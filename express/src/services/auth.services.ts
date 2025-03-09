import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import { filePathsObj } from '../data.path';
import { User } from '../types/userType';
import { ApiError } from '../../classes/ApiError';

// username, password: hashedPassword, birthDate -  Прилетают с фронта
export async function register(username: string, password: string, birthDate: string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8'));
    if (allUsers.find(u => username === u.username)) throw new ApiError(409,'Имя уже занято');
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser: User = {
        username,
        password: hashedPassword,
        birthDate,
        fullname: username,
        avatar: null,
        background: null,
        regDate: new Date().toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'}),
        isUserConfirmed: false,
        isUserTwitterCreator: false,
        userSubscribtions: [],
        userSubscribers: [],
        posts: {
            created: [],
            liked: [],
            saved: [],
        },
    }
    allUsers.push(newUser);
    await fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2));
    return newUser;
};

export async function login(username: string, password: string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath,'utf-8'));
    const user = allUsers.find(u => username === u.username);
    if (!user || !(await bcrypt.compare(password, user.password))) throw new ApiError(401,'Логин или пароль неверные');
    return user;
};