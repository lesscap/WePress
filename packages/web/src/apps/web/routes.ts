import { ChatController } from './controllers/chat.js'
import { ImageController } from './controllers/image.js'

export const Routes = {
  '/api/chat': ChatController,
  '/api/image': ImageController,
}
