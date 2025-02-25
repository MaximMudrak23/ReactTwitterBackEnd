import { Router } from "express";
import multer from 'multer';
import { getUserController, subscribeController, changeFNController, uploadAvatarController, uploadBackgroundController, deleteAvatarController, deleteBackgroundController } from '../controllers/user.controller';

const router = Router();
const uploadAvatar = multer({ dest: "data/userProfilePicture/" });
const uploadBackground = multer({ dest: 'data/userBackground/' })

router.get('/:username', getUserController);
router.post('/subscribe', subscribeController);
router.put('/changeFN', changeFNController);
router.post('/uploadAvatar', uploadAvatar.single('avatar'), uploadAvatarController);
router.post('/uploadBackground', uploadBackground.single('background'), uploadBackgroundController);
router.delete('/deleteAvatar', deleteAvatarController);
router.delete('/deleteBackground', deleteBackgroundController);


export default router;