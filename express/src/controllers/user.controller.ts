import { Request, Response } from "express";
import {
    getUserService,
    subscribeService,
    changeFNService,
    uploadAvatarService,
    uploadBackgroundService,
    deleteAvatarService,
    deleteBackgroundService,
    getUserRelationsService
} from '../services/user.services';
import { ApiError } from "../../classes/ApiError";

export async function getUserController(req: Request, res: Response) {
    try {
        const {username} = req.params;
        if (!username) throw new ApiError(400,'Не получен username');
        const user = await getUserService(username);
        if (!user) throw new ApiError(404,'Пользователь не найден');
        return res.status(200).json(user);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при получении пользователя:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при получении пользователя:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при получении пользователя:', error);
            return res.status(500).json({message: 'Ошибка при получении пользователя'});
        }
    }
}

export async function subscribeController(req: Request, res: Response) {
    try {
        const {currentUser, targetUser, isSubscribed} = req.body;
        if (!currentUser || !targetUser || isSubscribed === undefined || isSubscribed === null) throw new ApiError(400,'Не получены все данные про пользователя');
        const updatedSubscribersArr = await subscribeService(currentUser, targetUser, isSubscribed);
        if (!updatedSubscribersArr) throw new ApiError(500,'Ошибка на сервере');
        return res.status(200).json({userSubscribers: updatedSubscribersArr});
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при попытке подписаться:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при попытке подписаться:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при попытке подписаться:', error);
            return res.status(500).json({message: 'Ошибка при попытке подписаться'});
        }
    }
}

export async function changeFNController(req: Request, res: Response) {
    try {
        const {username, userFullName} = req.body;
        if (!username || !userFullName) throw new ApiError(400,'Не переданы все данные');
        await changeFNService(username,userFullName);
        return res.sendStatus(200);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при изменении имени:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при изменении имени:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при изменении имени:', error);
            return res.status(500).json({message: 'Ошибка при изменении имени'});
        }
    }
}

export async function uploadAvatarController(req: Request, res: Response) {
    
    try {
        const {username} = req.body;
        if (!username) throw new ApiError(400,'Не получено username');
        if (!req.file) throw new ApiError(400,'Файл не загружен');
        const newAvatarName = await uploadAvatarService(username, req.file.path, req.file.mimetype);
        const avatarURL = `http://localhost:3000/userProfilePicture/${newAvatarName}`;
        return res.status(200).json({message: 'Аватар успешно загружен!', avatar: avatarURL});
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при загрузке аватара:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при загрузке аватара:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при загрузке аватара:', error);
            return res.status(500).json({message: 'Ошибка при загрузке аватара'});
        }
    }
}

export async function uploadBackgroundController(req: Request, res: Response) {
    try {
        const {username} = req.body;
        if (!username) throw new ApiError(400,'Не получено username');
        if (!req.file) throw new ApiError(400,'Файл не загружен');
        const newBackgroundName = await uploadBackgroundService(username, req.file.path, req.file.mimetype);
        const backgroundURL = `http://localhost:3000/userBackground/${newBackgroundName}`;
        return res.status(200).json({message: 'Фон успешно загружен!', background: backgroundURL});
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при загрузке фона:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при загрузке фона:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при загрузке фона:', error);
            return res.status(500).json({message: 'Ошибка при загрузке фона'});
        }
    }
}

export async function deleteAvatarController(req: Request, res: Response) {
    try {
        const {username} = req.body;
        if (!username) throw new ApiError(400,'Не получено username');
        await deleteAvatarService(username);
        return res.status(204).json({message: 'Аватар успешно удален'});
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при удалении аватара:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при удалении аватара:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при удалении аватара:', error);
            return res.status(500).json({message: 'Ошибка при удалении аватара'});
        }
    }
}

export async function deleteBackgroundController(req: Request, res: Response) {
    try {
        const {username} = req.body;
        if (!username) throw new ApiError(400,'Не получено username');
        await deleteBackgroundService(username);
        return res.status(204).json({message: 'Фон удалён'}); // тут sendStatus потому-что при 204 не принято возвращать тело ответа
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при удалении фона:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при удалении фона:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при удалении фона:', error);
            return res.status(500).json({message: 'Ошибка при удалении фона'});
        }
    }
}

export async function getUserRelationsController(req: Request, res: Response) {
    try {
        const { username } = req.params;
        if (!username) throw new ApiError(400,'Ожидался username в параметрах');
        const userRelations = await getUserRelationsService(username);
        return res.status(200).json(userRelations);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при получении всех пользователей:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при получении всех пользователей:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при получении всех пользователей:', error);
            return res.status(500).json({message: 'Ошибка при получении всех пользователей'});
        }
    }
}