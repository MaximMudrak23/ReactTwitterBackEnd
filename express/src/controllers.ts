import fs from 'fs/promises';
import { Request, Response } from 'express';
import path from 'path';

const usersFilePath = path.join(__dirname, '../data/users.json');

export const registerUser = async (req: Request, res: Response) => {
    const { username, password, birth_date } = req.body;
    const regDate = new Intl.DateTimeFormat('ru-RU').format(new Date()).replace(/\./g, '-');

    if (!username || !password || !birth_date) {
        return res.status(400).json({ message: 'Все поля должны быть заполнены' });
    }

    try {
        const usersData = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(usersData || '[]');

        if (users.some((user: any) => user.username === username)) {
            return res.status(400).json({ message: 'Имя пользователя занято' });
        }

        const newUser = {
            username,
            password,
            birth_date,
            regDate,
            avatar: null,
        };

        users.push(newUser);
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

        res.status(201).json({ message: 'Регистрация успешна' });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Введите логин и пароль' });
    }

    try {
        const usersData = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(usersData || '[]');

        const user = users.find((user: any) => user.username === username);

        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Введите корректный логин и пароль' });
        }

        return res.status(200).json({ message: 'Вы успешно зашли на аккаунт' });
    } catch (error) {
        console.error('Ошибка логина:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
};
