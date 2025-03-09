import { Router } from 'express';
import { getUserController, subscribeController, changeFNController, deleteAvatarController, deleteBackgroundController } from '../controllers/user.controller';

const router = Router();

router.get('/:username', getUserController);
router.post('/subscribe', subscribeController);
router.put('/changeFN', changeFNController);
router.delete('/deleteAvatar', deleteAvatarController);
router.delete('/deleteBackground', deleteBackgroundController);

export default router;