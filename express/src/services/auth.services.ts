import fs from "fs/promises";
import bcrypt from 'bcrypt';
import { usersPath } from "../data.path";
import { User } from "../types/userType";

export async function register(username: string, password: string, birthDate: string) {
    try {
        const users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));
        
        if(users.find(user => user.username === username)) {
            throw new Error('Имя пользователя уже занято!');
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser: User = {
            id: Date.now().toString() + `_${username}`,
            username, // Прилетает с фронта
            password: hashedPassword, // Прилетает с фронта
            birthDate, // Прилетает с фронта
            fullname: username,
            avatar: null,
            background: null,
            isUserConfirmed: false,
            isUserTwitterCreator: false,
            userSubscribtions: [],
            userSubscribers: [],
            posts: {
                created: [],
                liked: [],
                saved: [],
            }
        }

        users.push(newUser);
        await fs.writeFile(usersPath, JSON.stringify(users,null,2));
        return newUser;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return null;
    }
};

export async function login (username: string, password: string) {
    try {
        const users: User[] = JSON.parse(await fs.readFile(usersPath,'utf-8'));
        const user = users.find(u => u.username === username);
        if(!user || !(await bcrypt.compare(password, user.password))) return null;
        return user || null;
    } catch (error) {
        console.error('Ошибка входа:',error);
        return null;
    }
};