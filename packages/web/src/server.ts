import 'dotenv/config'
import fastify from 'fastify'
import cookie from '@fastify/cookie'

export const createServer = async () => {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  })

  await server.register(cookie)

  server.get('/health', async () => {
    return { status: 'ok' }
  })

  server.get('/', async () => {
    return { message: 'WePress API' }
  })

  return server
}
