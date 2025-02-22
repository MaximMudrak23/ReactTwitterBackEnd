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

export async function subscribeService(currentUser: string, targetUser: string, isSubscribed: boolean) {
    try {
        const users: User[] = JSON.parse(await fs.readFile(usersPath, 'utf-8'));
        const user = users.find(u => u.username === targetUser);
        const subscriber = users.find(u => u.username === currentUser);
        
        if(!user || !subscriber) {
            throw new Error('Пользователь не найден');
        }

        if (isSubscribed) {
            user.userSubscribers = user.userSubscribers.filter(sub => sub !== currentUser);
            subscriber.userSubscribtions = subscriber.userSubscribtions.filter(sub => sub !== targetUser);
        } else {
            user.userSubscribers.push(currentUser);
            subscriber.userSubscribtions.push(targetUser);
        }

        await fs.writeFile(usersPath, JSON.stringify(users,null,2));
        return user.userSubscribers;
    } catch (error) {
        console.error('Ошибка подписки:', error);
        throw new Error('Ошибка подписки');
    }
}