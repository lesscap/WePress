import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cookie from '@fastify/cookie'
import fastifyStatic from '@fastify/static'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import { Routes } from './apps/web/routes.js'
import { Router } from './runners/router.js'
import { ServicePlugin } from './runners/service-plugin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const createServer = async () => {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  })

  // Static files for uploaded images
  await server.register(fastifyStatic, {
    root: path.join(__dirname, '../uploads'),
    prefix: '/uploads/',
    decorateReply: false,
  })

  await server.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'WePress API',
        description: 'API documentation for WePress',
        version: '0.0.1',
      },
    },
  })

  await server.register(swaggerUI, {
    routePrefix: '/docs',
  })

  await server.register(cookie)
  await server.register(ServicePlugin)
  await server.register(Router, { routes: Routes })

  server.get('/api/health', async () => {
    return { status: 'ok' }
  })

  return server
}
