import fs from 'fs/promises';
import { usersPath } from '../data.path';
import { User } from '../types/userType';

export async function getUserService(username:string) {
    try {
        const users: User[] = JSON.parse(await fs.readFile(usersPath, 'utf-8'));
        return users.find(u => u.username === username) || null;
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
        return null;
    }
}