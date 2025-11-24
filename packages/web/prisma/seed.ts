import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const templates = [
  {
    name: '简约白',
    description: '简洁大方的白色背景模板，适合各类文章',
    thumbnail: null,
    content: `<section style="padding: 20px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
{{#each sections}}
  {{#if (eq level 1)}}
  <h1 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin: 0 0 16px 0; line-height: 1.4;">{{title}}</h1>
  {{else if (eq level 2)}}
  <h2 style="font-size: 20px; font-weight: 600; color: #333333; margin: 24px 0 12px 0; line-height: 1.4;">{{title}}</h2>
  {{else}}
  <h3 style="font-size: 17px; font-weight: 600; color: #444444; margin: 20px 0 10px 0; line-height: 1.4;">{{title}}</h3>
  {{/if}}
  {{#if image}}
  <img src="{{image}}" style="max-width: 100%; height: auto; margin: 12px 0; border-radius: 4px;" />
  {{/if}}
  <p style="font-size: 16px; color: #333333; line-height: 1.8; margin: 0 0 16px 0; text-align: justify;">{{body}}</p>
{{/each}}
</section>`,
  },
  {
    name: '科技蓝',
    description: '蓝色科技风格，适合技术、产品类文章',
    thumbnail: null,
    content: `<section style="padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
{{#each sections}}
  {{#if (eq level 1)}}
  <h1 style="font-size: 26px; font-weight: 700; color: #0066cc; margin: 0 0 20px 0; line-height: 1.3; border-left: 4px solid #0066cc; padding-left: 16px;">{{title}}</h1>
  {{else if (eq level 2)}}
  <h2 style="font-size: 20px; font-weight: 600; color: #1a365d; margin: 28px 0 14px 0; line-height: 1.4; background-color: #e6f0ff; padding: 10px 14px; border-radius: 4px;">{{title}}</h2>
  {{else}}
  <h3 style="font-size: 17px; font-weight: 600; color: #2c5282; margin: 22px 0 10px 0; line-height: 1.4;">{{title}}</h3>
  {{/if}}
  {{#if image}}
  <img src="{{image}}" style="max-width: 100%; height: auto; margin: 14px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,102,204,0.15);" />
  {{/if}}
  <p style="font-size: 16px; color: #2d3748; line-height: 1.9; margin: 0 0 18px 0; text-align: justify;">{{body}}</p>
{{/each}}
</section>`,
  },
  {
    name: '商务灰',
    description: '沉稳的商务风格，适合企业、行业类文章',
    thumbnail: null,
    content: `<section style="padding: 28px 24px; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
{{#each sections}}
  {{#if (eq level 1)}}
  <h1 style="font-size: 24px; font-weight: 600; color: #1f2937; margin: 0 0 18px 0; line-height: 1.4; text-align: center; padding-bottom: 14px; border-bottom: 2px solid #374151;">{{title}}</h1>
  {{else if (eq level 2)}}
  <h2 style="font-size: 19px; font-weight: 600; color: #374151; margin: 26px 0 12px 0; line-height: 1.4;">{{title}}</h2>
  {{else}}
  <h3 style="font-size: 17px; font-weight: 500; color: #4b5563; margin: 20px 0 10px 0; line-height: 1.4;">{{title}}</h3>
  {{/if}}
  {{#if image}}
  <img src="{{image}}" style="max-width: 100%; height: auto; margin: 14px 0; border-radius: 2px;" />
  {{/if}}
  <p style="font-size: 16px; color: #4b5563; line-height: 1.85; margin: 0 0 16px 0; text-align: justify;">{{body}}</p>
{{/each}}
</section>`,
  },
  {
    name: '文艺棕',
    description: '温暖的文艺风格，适合生活、情感类文章',
    thumbnail: null,
    content: `<section style="padding: 24px 20px; background-color: #fdf8f3; font-family: Georgia, 'Times New Roman', serif;">
{{#each sections}}
  {{#if (eq level 1)}}
  <h1 style="font-size: 26px; font-weight: 400; color: #5d4037; margin: 0 0 20px 0; line-height: 1.5; text-align: center; letter-spacing: 2px;">{{title}}</h1>
  {{else if (eq level 2)}}
  <h2 style="font-size: 20px; font-weight: 400; color: #6d4c41; margin: 28px 0 14px 0; line-height: 1.5; border-left: 3px solid #a1887f; padding-left: 14px;">{{title}}</h2>
  {{else}}
  <h3 style="font-size: 18px; font-weight: 400; color: #795548; margin: 22px 0 10px 0; line-height: 1.5; font-style: italic;">{{title}}</h3>
  {{/if}}
  {{#if image}}
  <img src="{{image}}" style="max-width: 100%; height: auto; margin: 16px 0; border-radius: 6px; box-shadow: 0 4px 12px rgba(93,64,55,0.1);" />
  {{/if}}
  <p style="font-size: 16px; color: #5d4037; line-height: 2; margin: 0 0 18px 0; text-indent: 32px;">{{body}}</p>
{{/each}}
</section>`,
  },
  {
    name: '清新绿',
    description: '清新自然的绿色风格，适合健康、环保类文章',
    thumbnail: null,
    content: `<section style="padding: 22px 20px; background-color: #f0fdf4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
{{#each sections}}
  {{#if (eq level 1)}}
  <h1 style="font-size: 24px; font-weight: 600; color: #166534; margin: 0 0 18px 0; line-height: 1.4; text-align: center;">{{title}}</h1>
  {{else if (eq level 2)}}
  <h2 style="font-size: 19px; font-weight: 600; color: #15803d; margin: 26px 0 12px 0; line-height: 1.4; background-color: #dcfce7; padding: 8px 12px; border-radius: 6px; display: inline-block;">{{title}}</h2>
  {{else}}
  <h3 style="font-size: 17px; font-weight: 500; color: #22863a; margin: 20px 0 10px 0; line-height: 1.4;">{{title}}</h3>
  {{/if}}
  {{#if image}}
  <img src="{{image}}" style="max-width: 100%; height: auto; margin: 14px 0; border-radius: 8px;" />
  {{/if}}
  <p style="font-size: 16px; color: #374151; line-height: 1.85; margin: 0 0 16px 0; text-align: justify;">{{body}}</p>
{{/each}}
</section>`,
  },
]

async function main() {
  console.log('Seeding templates...')

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.name },
      update: template,
      create: {
        id: template.name,
        ...template,
      },
    })
    console.log(`Created template: ${template.name}`)
  }

  console.log('Seeding completed.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
