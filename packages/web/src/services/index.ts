import { LLMService } from './llm.js'
import { PrismaService } from './prisma.js'

export const services = {
  prisma: PrismaService,
  llm: LLMService,
}
