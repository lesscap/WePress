import { nanoid } from "nanoid";
import type { AgentProvider, QueryPromptMeta } from "../types";
import { buildSystemPrompt } from "../utils/prompt-tools/build-tools-description";
import { parseToolCallsFromText } from "../utils/tool-call-parser";

export type AIProxyProviderConfig = {
  model: string;
  baseUrl?: string; // defaults to '/api/chat/completions'
  temperature?: number; // defaults to 0.3
  maxTokens?: number; // defaults to 2000
};

type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
  meta?: QueryPromptMeta;
};

type OpenAIStreamChunk = {
  choices: Array<{
    delta: {
      content?: string;
    };
    finish_reason?: "stop" | "length" | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// Session history cache (in-memory, client-side)
const sessionCache = new Map<string, OpenAIMessage[]>();

/**
 * Calculate index to keep messages from (for compression)
 * Strategy: Keep recent N tool_result messages + older messages up to max length
 */
function calculateKeepFromIndex(
  history: OpenAIMessage[],
  recentCount: number,
  maxOlderLength: number,
): number {
  let toolResultCount = 0;
  let accumulatedLength = 0;

  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].meta?.type === "tool_result") {
      if (toolResultCount < recentCount) {
        toolResultCount++;
      } else {
        const contentLength = history[i].content.length;
        if (accumulatedLength + contentLength > maxOlderLength) {
          return i + 1;
        }
        accumulatedLength += contentLength;
      }
    }
  }

  return 0;
}

/**
 * Compress history messages
 * Keep recent tool_result messages, compress older ones
 */
function compressMessages(
  history: OpenAIMessage[],
  keepFromIndex: number,
): Array<{ role: string; content: string }> {
  return history.map((msg, index) => {
    const shouldKeep = index >= keepFromIndex;

    if (shouldKeep) {
      return { role: msg.role, content: msg.content };
    }

    if (msg.meta?.type === "tool_result") {
      return { role: msg.role, content: "[Historical tool result compressed]" };
    }

    return { role: msg.role, content: msg.content };
  });
}

/**
 * Create AI Proxy Provider
 * Connects to backend /api/chat/completions endpoint
 */
export function createAIProxyProvider(
  config: AIProxyProviderConfig,
): AgentProvider {
  const {
    model,
    baseUrl = "/api/chat/completions",
    temperature = 0.3,
    maxTokens = 2000,
  } = config;

  const send: AgentProvider["send"] = async function* (options) {
    const conversationId = nanoid();

    // Get session history
    const history = sessionCache.get(options.sessionId) || [];

    // Build system message if needed
    const needsSystemPrompt =
      (options.tools && options.tools.length > 0) || options.systemPrompt;
    const systemMessage: OpenAIMessage[] = needsSystemPrompt
      ? [
          {
            role: "system",
            content: buildSystemPrompt(
              options.tools || [],
              options.systemPrompt,
            ),
          },
        ]
      : [];

    // Compress history (keep recent 3 tool results + 5000 chars of older ones)
    const keepFromIndex = calculateKeepFromIndex(history, 3, 5000);
    const compressedHistory = compressMessages(history, keepFromIndex);

    // Add current user message
    const currentUserMsg: OpenAIMessage = {
      role: "user",
      content: options.prompt,
      meta: options.meta,
    };

    // Build request messages
    const requestMessages = [
      ...systemMessage,
      ...compressedHistory,
      { role: currentUserMsg.role, content: currentUserMsg.content },
    ];

    // Send request
    let response: Response;
    try {
      response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: requestMessages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        }),
        signal: options.signal,
      });
    } catch (error) {
      if (options.signal?.aborted) {
        yield {
          type: "abort",
          messageId: nanoid(),
          conversationId,
          content: { reason: "Request aborted by user" },
          timestamp: new Date().toISOString(),
        };
        return;
      }

      yield {
        type: "error",
        messageId: nanoid(),
        conversationId,
        content: {
          error: error instanceof Error ? error.message : String(error),
          code: "FETCH_ERROR",
        },
        timestamp: new Date().toISOString(),
      };
      return;
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      yield {
        type: "error",
        messageId: nanoid(),
        conversationId,
        content: {
          error: `HTTP ${response.status}: ${errorText}`,
          code: "HTTP_ERROR",
        },
        timestamp: new Date().toISOString(),
      };
      return;
    }

    // Parse SSE stream
    const reader = response.body?.getReader();
    if (!reader) {
      yield {
        type: "error",
        messageId: nanoid(),
        conversationId,
        content: { error: "No response body", code: "NO_BODY" },
        timestamp: new Date().toISOString(),
      };
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    let hasYielded = false;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();

          if (!trimmed || trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const chunk: OpenAIStreamChunk = JSON.parse(trimmed.slice(6));

              // Handle usage
              if (chunk.usage) {
                yield {
                  type: "usage",
                  messageId: nanoid(),
                  conversationId,
                  content: {
                    promptTokens: chunk.usage.prompt_tokens,
                    completionTokens: chunk.usage.completion_tokens,
                    totalTokens: chunk.usage.total_tokens,
                  },
                  timestamp: new Date().toISOString(),
                };
              }

              const choice = chunk.choices[0];
              if (!choice) continue;

              // Handle content delta
              if (choice.delta?.content) {
                fullText += choice.delta.content;
                hasYielded = true;

                yield {
                  type: "text",
                  messageId: nanoid(),
                  conversationId,
                  content: {
                    text: choice.delta.content,
                    status: "DOING",
                  },
                  delta: true,
                  timestamp: new Date().toISOString(),
                };
              }

              // Handle completion
              if (
                choice.finish_reason === "stop" ||
                choice.finish_reason === "length"
              ) {
                yield {
                  type: "text",
                  messageId: nanoid(),
                  conversationId,
                  content: {
                    text: fullText,
                    status: "DONE",
                  },
                  delta: false,
                  timestamp: new Date().toISOString(),
                };

                // Update session cache
                const fullMessages = [...history, currentUserMsg];
                const assistantMsg: OpenAIMessage = {
                  role: "assistant",
                  content: fullText,
                };
                sessionCache.set(options.sessionId, [
                  ...fullMessages,
                  assistantMsg,
                ]);
              }
            } catch (error) {
              console.error("Failed to parse SSE chunk:", error);
            }
          }
        }
      }

      // If stream ended but no finish_reason, send final message
      if (hasYielded) {
        yield {
          type: "text",
          messageId: nanoid(),
          conversationId,
          content: {
            text: fullText,
            status: "DONE",
          },
          delta: false,
          timestamp: new Date().toISOString(),
        };

        // Update session cache
        const fullMessages = [...history, currentUserMsg];
        const assistantMsg: OpenAIMessage = {
          role: "assistant",
          content: fullText,
        };
        sessionCache.set(options.sessionId, [...fullMessages, assistantMsg]);
      }

      // Parse tool calls from full text
      if (options.tools && options.tools.length > 0 && fullText) {
        const toolCallMessages = parseToolCallsFromText(
          fullText,
          conversationId,
        );
        for (const msg of toolCallMessages) {
          yield msg;
        }
      }
    } catch (error) {
      yield {
        type: "error",
        messageId: nanoid(),
        conversationId,
        content: {
          error: error instanceof Error ? error.message : String(error),
          code: "STREAM_ERROR",
        },
        timestamp: new Date().toISOString(),
      };
    } finally {
      reader.releaseLock();
    }
  };

  const clear: AgentProvider["clear"] = (sessionId) => {
    sessionCache.delete(sessionId);
  };

  return { send, clear };
}
