import { Request, Response } from "express";
import { register, login } from "../services/auth.services";

export async function registerUser (req: Request, res: Response) {
    const { username, password, birthDate } = req.body;
    const user = await register(username, password, birthDate);
    return user ? res.status(201).json(user) : res.status(400).json({message: 'Имя пользователя занято!'})
};

export async function loginUser (req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await login(username, password);
    return user ? res.status(200).json(user) : res.status(401).json({message: 'Неверные данные!'});
};
