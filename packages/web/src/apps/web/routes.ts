import { ChatController } from './controllers/chat.js'
import { ImageController } from './controllers/image.js'
import { TemplateController } from './controllers/template.js'

export const Routes = {
  '/api/chat': ChatController,
  '/api/image': ImageController,
  '/api/templates': TemplateController,
}
