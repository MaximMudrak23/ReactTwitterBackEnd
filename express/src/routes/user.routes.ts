import { Router } from "express";
import { getUserController, subscribeController } from '../controllers/user.controller';

const router = Router();

router.get('/:username', getUserController);
router.post('/subscribe', subscribeController)

export default router;