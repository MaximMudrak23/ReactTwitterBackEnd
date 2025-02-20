import { Router } from "express";
import { getUserController } from '../controllers/user.controller';

const router = Router();

router.get('/:username', getUserController);

export default router;