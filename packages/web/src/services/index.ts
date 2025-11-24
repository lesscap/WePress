import type { PrismaClient } from '@prisma/client'
import type { ServiceFactory } from '../types/index.js'
import { LLMService } from './llm.js'
import { PrismaService } from './prisma.js'

export const services = {
  $prisma: PrismaService,
  $llm: LLMService,
} as Record<string, ServiceFactory>

export type Services = {
  $prisma: PrismaClient
  $llm: ReturnType<typeof LLMService>
}
