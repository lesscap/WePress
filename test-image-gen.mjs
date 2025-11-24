#!/usr/bin/env node

const apiKey = process.env.DASHSCOPE_API_KEY

if (!apiKey) {
  console.error('Error: DASHSCOPE_API_KEY not set')
  process.exit(1)
}

const DASHSCOPE_IMAGE_API = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

async function testImageGeneration() {
  const prompt = '一个简单的测试图片：蓝天白云下的草地'

  console.log('Testing DashScope Image Generation API...')
  console.log('Prompt:', prompt)
  console.log('API Key:', apiKey.substring(0, 10) + '...')
  console.log()

  try {
    const requestBody = {
      model: 'qwen-image-plus',
      input: {
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }],
          },
        ],
      },
      parameters: {
        negative_prompt: '',
        prompt_extend: true,
        watermark: false,
        size: '1328*1328',
      },
    }

    console.log('Request body:')
    console.log(JSON.stringify(requestBody, null, 2))
    console.log()

    const response = await fetch(DASHSCOPE_IMAGE_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:')
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`)
    }
    console.log()

    const responseText = await response.text()

    if (!response.ok) {
      console.error('Error response:')
      console.error(responseText)
      process.exit(1)
    }

    const data = JSON.parse(responseText)
    console.log('Success! Response:')
    console.log(JSON.stringify(data, null, 2))

    const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image

    if (imageUrl) {
      console.log()
      console.log('✅ Image URL:', imageUrl)
    } else {
      console.log()
      console.warn('⚠️  No image URL found in response')
    }
  } catch (error) {
    console.error('Exception:', error.message)
    process.exit(1)
  }
}

testImageGeneration()
