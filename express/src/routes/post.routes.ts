import { Router } from "express";
import { addPostController, getPostController, pinPostController, editPostController, deletePostController, toggleLikeController, toggleSaveController } from "../controllers/post.controller";

const router = Router();

router.get('/getPost/:username', getPostController);
router.post('/addPost', addPostController);
router.patch('/pin/:postId', pinPostController);
router.patch('/edit/:postId', editPostController);
router.delete('/delete/:postId', deletePostController);
router.patch("/toggleLike/:postId", toggleLikeController);
router.patch("/toggleSave/:postId", toggleSaveController);

export default router;