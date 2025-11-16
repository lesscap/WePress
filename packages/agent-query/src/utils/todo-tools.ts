import type { TodoItem, TodoList, ToolDefinition } from '../types'

/**
 * TODO tool definitions for agent mode task management
 */
export const TODO_CREATE_TOOL: ToolDefinition = {
  name: 'todo_create',
  description: 'Create task list (in execution order)',
  parameters: {
    type: 'object',
    properties: {
      tasks: {
        type: 'array',
        description: 'Task list in execution order. Must be string array, e.g.: ["Task 1", "Task 2"]',
        items: { type: 'string', description: 'Single task description' },
      },
    },
    required: ['tasks'],
  },
  examples: ['<tool_call>{"name":"todo_create","arguments":{"tasks":["Check weather","Calculate result","Return answer"]}}</tool_call>'],
}

export const TODO_ADD_TOOL: ToolDefinition = {
  name: 'todo_add',
  description: 'Add task dynamically',
  parameters: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Task description' },
      index: { type: 'number', description: 'Insert position index (optional, defaults to end)' },
    },
    required: ['text'],
  },
  examples: [
    '<tool_call>{"name":"todo_add","arguments":{"text":"New task"}}</tool_call>',
    '<tool_call>{"name":"todo_add","arguments":{"text":"Insert task","index":1}}</tool_call>',
  ],
  notes: 'index is optional, defaults to appending at end',
}

export const TODO_UPDATE_TOOL: ToolDefinition = {
  name: 'todo_update',
  description: 'Update task status (record result when completed)',
  parameters: {
    type: 'object',
    properties: {
      index: { type: 'number', description: 'Task index (0-based)' },
      status: {
        type: 'string',
        enum: ['pending', 'completed'],
        description: 'New status: pending or completed',
      },
      result: {
        type: 'string',
        description: 'Task execution result (optional). Recommended when marking as completed, e.g., "Beijing weather: Sunny 15°C"',
      },
    },
    required: ['index', 'status'],
  },
  examples: ['<tool_call>{"name":"todo_update","arguments":{"index":0,"status":"completed","result":"Beijing 15°C"}}</tool_call>'],
  notes: 'Recommend recording result when status is completed',
}

export const TODO_TOOLS = [TODO_CREATE_TOOL, TODO_ADD_TOOL, TODO_UPDATE_TOOL]

// Session-level TODO storage (in-memory)
const todoStore = new Map<string, TodoList>()

export function getTodoList(sessionId: string): TodoList | undefined {
  return todoStore.get(sessionId)
}

export function createTodoList(sessionId: string, tasks: string[] | null): TodoList {
  const safeTasks = tasks || []
  const items: TodoItem[] = safeTasks.map((task) => ({
    status: 'pending',
    content: task,
  }))

  const newTodoList: TodoList = {
    items,
    version: Date.now(),
  }

  todoStore.set(sessionId, newTodoList)
  return newTodoList
}

export function addTodoItem(sessionId: string, text: string, index?: number): TodoList {
  const oldTodoList = todoStore.get(sessionId)

  const newItem: TodoItem = {
    status: 'pending',
    content: text,
  }

  let newItems: TodoItem[]
  if (!oldTodoList) {
    newItems = [newItem]
  } else {
    if (index !== undefined && index >= 0 && index <= oldTodoList.items.length) {
      newItems = [...oldTodoList.items.slice(0, index), newItem, ...oldTodoList.items.slice(index)]
    } else {
      newItems = [...oldTodoList.items, newItem]
    }
  }

  const newTodoList: TodoList = {
    items: newItems,
    version: Date.now(),
  }

  todoStore.set(sessionId, newTodoList)
  return newTodoList
}

export function updateTodoItem(
  sessionId: string,
  index: number,
  status: TodoItem['status'],
  result?: string,
): TodoList {
  const oldTodoList = todoStore.get(sessionId)

  if (!oldTodoList) {
    throw new Error(`No TODO list found for session: ${sessionId}`)
  }

  if (index < 0 || index >= oldTodoList.items.length) {
    throw new Error(`Invalid TODO index: ${index}`)
  }

  const newItems = oldTodoList.items.map((item, i) => {
    if (i === index) {
      return {
        ...item,
        status,
        ...(result !== undefined && { result }),
      }
    }
    return item
  })

  const newTodoList: TodoList = {
    items: newItems,
    version: Date.now(),
  }

  todoStore.set(sessionId, newTodoList)
  return newTodoList
}

export function clearTodoList(sessionId: string): void {
  todoStore.delete(sessionId)
}

export function hasUncompletedTodos(sessionId: string): boolean {
  const todoList = getTodoList(sessionId)
  if (!todoList || todoList.items.length === 0) {
    return false
  }
  return todoList.items.some((item) => item.status === 'pending')
}

export function formatTodoListForPrompt(todoList: TodoList): string {
  if (todoList.items.length === 0) {
    return 'No TODO tasks.'
  }

  const lines = todoList.items.map((item, index) => {
    const statusText = item.status === 'completed' ? '[Completed]' : '[Pending]'
    const resultSuffix = item.result ? ` -> Result: ${item.result}` : ''
    return `${index}. ${statusText} ${item.content}${resultSuffix}`
  })

  return `Current TODO list:\n${lines.join('\n')}`
}
