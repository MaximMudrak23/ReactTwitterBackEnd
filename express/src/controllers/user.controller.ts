import { Request, Response } from "express";
import { getUserService } from '../services/user.services';

export async function getUserController(req: Request, res: Response) {
    const { username } = req.params;
    const user = await getUserService(username);
    return !user ? res.status(404).json({message:'Пользователь не найден'}) : res.status(200).json(user);
}