import { Router } from 'express';
import multer from 'multer';
import path from "path";
import { uploadAvatarController, uploadBackgroundController } from '../controllers/user.controller';

const router = Router();
const uploadAvatar = multer({ dest: path.join(__dirname, '../../data/userProfilePicture/') });
const uploadBackground = multer({ dest: path.join(__dirname, '../../data/userBackground/') });

router.post('/uploadAvatar', uploadAvatar.single('avatar'), uploadAvatarController);
router.post('/uploadBackground', uploadBackground.single('background'), uploadBackgroundController);

export default router;