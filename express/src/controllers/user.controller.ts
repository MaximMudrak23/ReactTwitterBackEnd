import { Request, Response } from "express";
import { getUserService, subscribeService } from '../services/user.services';

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