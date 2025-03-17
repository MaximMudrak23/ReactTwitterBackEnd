import { Request, Response } from 'express';
import { ApiError } from '../../classes/ApiError';
import { getAllChatsService, openChatService, getFullChatService, sendMessageService } from '../services/chat.services';

export async function getAllChatsController(req: Request, res: Response) {
    try {
        const { username } = req.params;
        if (!username) throw new ApiError(404,'Юзернейм не был получен');
        const chatFullData = await getAllChatsService(username);
        return res.status(200).json(chatFullData);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при получении чатов:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при получении чатов:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при получении чатов:', error);
            return res.status(500).json({message: 'Ошибка при получении чатов'});
        }
    }
};

export async function openChatController(req: Request, res: Response) {
    try {
        const {initiatorUsername, targetUsername} = req.body;
        if (!initiatorUsername || !targetUsername) throw new ApiError(404,'Пользователи не получены');
        const chatID = await openChatService(initiatorUsername, targetUsername);
        return res.status(200).json(chatID);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при открытии чата:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при открытии чата:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при открытии чата:', error);
            return res.status(500).json({message: 'Ошибка при открытии чата'});
        }
    }
};

export async function getFullChatConroller(req: Request, res: Response) {
    try {
        const {chatID} = req.params;
        if (!chatID) throw new ApiError(404,'chatID не передан');
        const chatData = await getFullChatService(chatID);
        return res.status(200).json(chatData);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при получении информации о чате:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при получении информации о чате:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при получении информации о чате:', error);
            return res.status(500).json({message: 'Ошибка при получении информации о чате'});
        }
    }
}

export async function sendMessageController(req: Request, res: Response) {
    try {
        const {chatID, author, text, date, isRead} = req.body;
        if (!chatID || !author || !text || !date || isRead === undefined || isRead === null) throw new ApiError(404,'Отсутствуют данные');
        const newMessage = await sendMessageService(chatID, author, text, date, isRead);
        return res.status(201).json(newMessage);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Ошибка при получении информации о чате:', error.message);
            return res.status(error.status).json({message: error.message});
        } else if (error instanceof Error && error.constructor === Error) {
            console.error('Ошибка при получении информации о чате:', error.message);
            return res.status(500).json({message: error.message});
        } else {
            console.error('Ошибка при получении информации о чате:', error);
            return res.status(500).json({message: 'Ошибка при получении информации о чате'});
        }
    }
}