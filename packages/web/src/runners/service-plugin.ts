import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { start } from '../core/service.js'
import { services } from '../services/index.js'
import type { Dict } from '../types/index.js'

export const ServicePlugin = fp(async (app: FastifyInstance) => {
  const [sapp, cleanup] = await start(services)
  const sdict = sapp as Dict
  Object.keys(sapp).forEach(name => {
    app.decorate(name, sdict[name])
  })
  app.addHook('onClose', async () => {
    await cleanup()
  })
})
