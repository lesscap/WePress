import { PrismaClient } from '@prisma/client'
import type { Application } from '../types/index.js'

type QueryEvent = {
  query: unknown
  duration: number
  params: unknown
}

export const PrismaService = (_app: Application) => {
  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ],
    errorFormat: 'colorless',
  })

  client.$on('query', (e: QueryEvent) => {
    global.console.debug('Query', e.query, e.params)
    global.console.debug(`Duration: ${e.duration}ms`)
  })

  const stop = async () => {
    await client.$disconnect()
  }

  return [client, stop]
}
