import { Request, Response } from "express";
import { getUserService, subscribeService, changeFNService, uploadAvatarService, uploadBackgroundService, deleteAvatarService, deleteBackgroundService } from '../services/user.services';

export async function getUserController(req: Request, res: Response) {
    const { username } = req.params;
    const user = await getUserService(username);
    return !user ? res.status(404).json({message:'Пользователь не найден'}) : res.status(200).json(user);
}

export async function subscribeController(req: Request, res: Response) {
    const { currentUser, targetUser, isSubscribed } = req.body;

    try {
        const updatedSubscribersArr = await subscribeService(currentUser, targetUser, isSubscribed);
        return res.status(200).json({success: true, userSubscribers: updatedSubscribersArr});
    } catch (error) {
        console.error('Ошибка подписки:', error)
        return res.status(500).json({message: 'Ошибка запроса!'});
    }
}

export async function changeFNController(req: Request, res: Response) {
    const {username, userFullName} = req.body;

    if(!username || !userFullName) {
        return res.status(400).json({message: 'Нужны username и userFullName'});
    }

    try {
        await changeFNService(username, userFullName);
        return res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при обновлении имени:', error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
}

export async function uploadAvatarController(req: Request, res: Response) {
    const { username } = req.body;
    if (!req.file) return res.status(400).json({ message: "Файл не загружен" });

    try {
        const newAvatarName = await uploadAvatarService(username, req.file.path, req.file.mimetype);
        const avatarURL = `http://localhost:3000/userProfilePicture/${newAvatarName}`;
        
        return res.status(200).json({ message: "Аватар успешно загружен!", avatar: avatarURL });
    } catch (error) {
        console.error("Ошибка загрузки аватара:", error);
        return res.status(500).json({ message: "Ошибка загрузки аватара!" });
    }
}

export async function uploadBackgroundController(req: Request, res: Response) {
    const { username } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Файл не загружен' });

    try {
        const newBackgroundName = await uploadBackgroundService(username, req.file.path, req.file.mimetype);
        const backgroundURL = `http://localhost:3000/userBackground/${newBackgroundName}`;

        return res.status(200).json({message: 'Фон успешно загружен!', background: backgroundURL});
    } catch (error) {
        console.error('Ошибка загрузки фона:', error);
        return res.status(500).json({message: 'Ошибка загрузки фона'});
    }
}

export async function deleteAvatarController(req: Request, res: Response) {
    const { username } = req.body;

    try {
        await deleteAvatarService(username);
        return res.status(200).json({ message: "Аватар удалён" });
    } catch (error) {
        console.error("Ошибка удаления аватара:", error);
        return res.status(500).json({ message: "Ошибка удаления аватара" });
    }
}

export async function deleteBackgroundController(req: Request, res: Response) {
    const { username } = req.body;

    try {
        await deleteBackgroundService(username);
        return res.status(200).json({ message: "Фон удалён" });
    } catch (error) {
        console.error("Ошибка удаления фона:", error);
        return res.status(500).json({ message: "Ошибка удаления фона" });
    }
}
