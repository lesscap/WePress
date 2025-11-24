import type { FastifyInstance } from 'fastify'
import type { Services } from '../services/index.js'

export type Dict = Record<string, unknown>

export type ServiceFactory = <T>(app: Application) => [T, () => void] | T

export type Application = Services & {
  $$defines?: Record<string, ServiceFactory>
}

export type WebApplication = FastifyInstance & Application
