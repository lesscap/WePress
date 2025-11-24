import type { WebApplication } from '../../../types/index.js'

const ListTemplatesSchema = {
  summary: 'List all templates',
  tags: ['template'],
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          thumbnail: { type: 'string', nullable: true },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
    },
  },
}

const GetTemplateSchema = {
  summary: 'Get template by ID',
  tags: ['template'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        thumbnail: { type: 'string', nullable: true },
        content: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

export const TemplateController = (app: WebApplication) => {
  // List templates (without content for performance)
  app.get('/', { schema: ListTemplatesSchema }, async () => {
    return app.$prisma.template.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })
  })

  // Get single template with content
  app.get<{ Params: { id: string } }>('/:id', { schema: GetTemplateSchema }, async (request, reply) => {
    const { id } = request.params
    const template = await app.$prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      return reply.code(404).send({ error: 'Template not found' })
    }

    return template
  })
}
