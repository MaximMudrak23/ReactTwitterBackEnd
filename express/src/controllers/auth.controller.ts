import { Request, Response } from 'express';
import { register, login } from '../services/auth.services';
import { ApiError } from '../../classes/ApiError';

export async function registerUser(req: Request, res: Response) {
    try {
        const {username, password, birthDate} = req.body;
        if (!username || !password || !birthDate) throw new ApiError(400, 'Информация о пользователе не получена!');
        const user = await register(username, password, birthDate);
        return res.status(201).json(user);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при регистрации:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при регистрации:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при регистрации:', error);
            return res.status(500).json({message: 'Ошибка при регистрации'});
        }
    }
};

export async function loginUser(req: Request, res: Response) {
   try {
        const {username, password} = req.body;
        if (!username || !password) throw new ApiError(400, 'Информация о пользователе не получена!');
        const user = await login(username, password);
        return res.status(200).json(user);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при входе:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при входе:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при входе:', error);
            return res.status(500).json({message: 'Ошибка при входе'});
        }
    }
};