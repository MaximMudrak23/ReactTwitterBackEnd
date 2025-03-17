import { Router } from 'express';
import { getAllChatsController, openChatController, getFullChatConroller, sendMessageController } from '../controllers/chat.controller';

const router = Router();

router.get('/:username', getAllChatsController);
router.post('/openChat', openChatController);
router.get('/getFullChat/:chatID', getFullChatConroller)
router.post('/sendMessage', sendMessageController)

export default router;