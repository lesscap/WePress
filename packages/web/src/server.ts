import 'dotenv/config'
import cookie from '@fastify/cookie'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import { Routes } from './apps/web/routes.js'
import { Router } from './runners/router.js'
import { ServicePlugin } from './runners/service-plugin.js'

export const createServer = async () => {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
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

  server.get('/health', async () => {
    return { status: 'ok' }
  })

  return server
}
