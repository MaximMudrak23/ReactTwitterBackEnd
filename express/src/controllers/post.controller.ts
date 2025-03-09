import { Request, Response } from 'express';
import { getPostService, addPostService, editPostService, deletePostService, pinPostService, toggleLikeService, toggleSaveService } from '../services/post.services';
import { ApiError } from '../../classes/ApiError';

export async function getPostController(req: Request, res: Response) {
    try {
        const {username} = req.params;
        if (!username) throw new ApiError(400,'Имя пользователя не получено!');
        const userPosts = await getPostService(username);
        return res.status(200).json(userPosts);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при получении поста:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при получении поста:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при получении поста:', error);
            return res.status(500).json({message: 'Ошибка при получении поста'});
        }
    }
}

export async function addPostController(req: Request, res: Response) {
    try {
        const {username, text, id} = req.body;
        if (!username || !text || !id) throw new ApiError(400, 'Не вся информация получена!')
        const newPost = await addPostService(username, text, id);
        return res.status(201).json(newPost);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при добавлении поста:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при добавлении поста:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при добавлении поста:', error);
            return res.status(500).json({message: 'Ошибка при добавлении поста'});
        }
    }
}

export async function editPostController(req: Request, res: Response) {
    try {
        const {postId} = req.params;
        const {newText} = req.body;
        if (!postId || !newText) throw new ApiError(400, 'Не все данные получены!');
        const updatedPost = await editPostService(postId, newText);
        return res.status(200).json(updatedPost);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при редактировании поста:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при редактировании поста:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при редактировании поста:', error);
            return res.status(500).json({message: 'Ошибка при редактировании поста'});
        }
    }
}

export async function deletePostController(req: Request, res: Response) {
    try {
        const {postId} = req.params;
        if (!postId) throw new ApiError(400, 'Не передан ID поста');
        await deletePostService(postId);
        return res.status(204).json({message: 'Пост успешно удален'});
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при удалении поста:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при удалении поста:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при удалении поста:', error);
            return res.status(500).json({message: 'Ошибка при удалении поста'});
        }
    }
}

export async function pinPostController(req: Request, res: Response) {
    try {
        const {postId} = req.params;
        const {isPinned} = req.body;
        if (!postId || isPinned === undefined || isPinned === null) throw new ApiError(400,'Не передан ID поста, либо isPinned');
        const updatedPost = await pinPostService(postId, isPinned);
        return res.status(200).json(updatedPost);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при закреплении поста:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при закреплении поста:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при закреплении поста:', error);
            return res.status(500).json({message: 'Ошибка при закреплении поста'});
        }
    }
}

export async function toggleLikeController(req: Request, res: Response) {
    try {
        const {postId} = req.params;
        const {username} = req.body;
        if (!postId || !username) throw new ApiError(400,'Не указан ID поста, либо username');
        const updatedPost = await toggleLikeService(postId, username);
        return res.status(200).json(updatedPost);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при изменении лайка:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при изменении лайка:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при изменении лайка:', error);
            return res.status(500).json({message: 'Ошибка при изменении лайка'});
        }
    }
}

export async function toggleSaveController(req: Request, res: Response) {
    try {
        const {postId} = req.params;
        const {username} = req.body;
        if (!postId || !username) throw new ApiError(400,'Не указан ID поста, либо username');
        const updatedPost = await toggleSaveService(postId, username);
        return res.status(200).json(updatedPost);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при изменении сохранения:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при изменении сохранения:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при изменении сохранения:', error);
            return res.status(500).json({message: 'Ошибка при изменении сохранения'});
        }
    }
}