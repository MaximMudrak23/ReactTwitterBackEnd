import { Request, Response } from "express";
import { register, login } from "../services/auth.services";

export async function registerUser (req: Request, res: Response) {
    const { username, password, birthDate } = req.body;
    const user = await register(username, password, birthDate);
    if (!user) return res.status(400).json({message: 'Имя пользователя занято!'})
    res.status(201).json(user);
};

export async function loginUser (req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await login(username, password);
    if (!user) return res.status(401).json({message: 'Неверные данные!'});
    res.status(200).json(user);
};
