import { Request, Response } from "express";
import { addPostService, getPostService, pinPostService, editPostService, deletePostService, toggleLikeService, toggleSaveService } from "../services/post.services";

export async function addPostController(req: Request, res: Response) {
    try {
        const { text, username, id } = req.body;

        if (!text || !username || !id) {
            return res.status(400).json({ message: "Текст и имя пользователя обязательны" });
        }

        const newPost = await addPostService(text, username, id);
        return res.status(201).json(newPost);
    } catch (error) {
        console.error("Ошибка при добавлении поста:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

export async function getPostController(req: Request, res: Response) {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ message: "Имя пользователя не указано" });
        }

        const userPosts = await getPostService(username);
        return res.status(200).json(userPosts);
    } catch (error) {
        console.error("Ошибка при получении постов:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

export async function pinPostController(req: Request, res: Response) {
    try {
        const { postId } = req.params;
        const { isPinned } = req.body;

        if (!postId || isPinned === undefined) {
            return res.status(400).json({ message: "Отсутствуют данные" });
        }

        const updatedPost = await pinPostService(postId, isPinned);
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Ошибка при закреплении поста:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

export async function editPostController(req: Request, res: Response) {
    try {
        const { postId } = req.params;
        const { newText } = req.body;

        if (!postId || !newText.trim()) {
            return res.status(400).json({ message: "ID поста и новый текст обязательны" });
        }

        const updatedPost = await editPostService(postId, newText);
        return res.json(updatedPost);
    } catch (error) {
        console.error("Ошибка при редактировании поста:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

export async function deletePostController(req: Request, res: Response) {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ message: "ID поста обязателен" });
        }

        await deletePostService(postId);
        return res.json({ message: "Пост успешно удалён" });

    } catch (error) {
        console.error("Ошибка при удалении поста:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

export async function toggleLikeController(req: Request, res: Response) {
    try {
        const { postId } = req.params;
        const { username } = req.body;

        if (!postId || !username) {
            return res.status(400).json({ message: "Отсутствуют данные" });
        }

        const updatedPost = await toggleLikeService(postId, username);
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Ошибка при изменении лайка:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

export async function toggleSaveController(req: Request, res: Response) {
    try {
        const { postId } = req.params;
        const { username } = req.body;

        if (!postId || !username) {
            return res.status(400).json({ message: "Отсутствуют данные" });
        }

        const updatedPost = await toggleSaveService(postId, username);
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Ошибка при изменении сохранения:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}