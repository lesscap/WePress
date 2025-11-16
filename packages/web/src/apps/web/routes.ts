import { ChatController } from './controllers/chat.js'
import { ParsingController } from './controllers/parsing.js'

export const Routes = {
  '/api/chat': ChatController,
  '/api/parsing': ParsingController,
}
