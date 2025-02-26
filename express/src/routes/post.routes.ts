import { Router } from "express";
import { addPostController, getPostController } from "../controllers/post.controller";

const router = Router();

router.get('/getPost/:username', getPostController);
router.post('/addPost', addPostController);


export default router;