import { Request, Response } from "express";
import { addPostService, getPostService } from "../services/post.services";

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