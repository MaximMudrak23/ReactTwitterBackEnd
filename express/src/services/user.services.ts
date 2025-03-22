import fs from 'fs/promises';
import path from "path";
import { filePathsObj } from "../data.path";
import { User } from '../types/userType';
import { ApiError } from '../../classes/ApiError';

export async function getUserService(username:string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8'));
    return allUsers.find(u => username === u.username);
}

export async function subscribeService(currentUser: string, targetUser: string, isSubscribed: boolean) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath,'utf-8'));
    const user = allUsers.find(u => u.username === targetUser);
    const subscriber = allUsers.find(u => u.username === currentUser);
    if (!user || !subscriber) throw new ApiError(404,'Пользователи не найдены');
    if (isSubscribed) {
        user.userSubscribers = user.userSubscribers.filter(x => x !== currentUser);
        subscriber.userSubscribtions = subscriber.userSubscribtions.filter(x => x !== targetUser);
    } else {
        user.userSubscribers.push(currentUser);
        subscriber.userSubscribtions.push(targetUser);
    }
    await fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2));
    return user.userSubscribers;
}

export async function changeFNService(username:string, userFullName:string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath,'utf-8'));
    const user = allUsers.find(u => username === u.username);
    if (!user) throw new ApiError(404,'Пользователь не найден');
    user.fullname = userFullName;
    await fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2));
}

export async function uploadAvatarService(username: string, filePath: string, mimeType: string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8'));
    const user = allUsers.find(u => username === u.username);
    if (!user) throw new ApiError(404,'Пользователь не найден');
    const extention = mimeType === 'image/png' ? 'png' : 'jpg';
    const newAvatarName = `${username}.${extention}`;
    const newAvatarPath = path.join(filePathsObj.userProfilePicturePath, newAvatarName);
    const oldAvatar = user.avatar;
    if (oldAvatar) {
        const oldAvatarFileName = path.basename(oldAvatar);
        const oldAvatarPath = path.join(filePathsObj.userProfilePicturePath, oldAvatarFileName);
        await fs.unlink(oldAvatarPath).catch((err) => {
            console.error(`Ошибка удаления старого аватара (${oldAvatarPath}):`, err);
        });
    };
    await fs.rename(filePath, newAvatarPath);
    const avatarURL = `http://localhost:3000/userProfilePicture/${newAvatarName}`;
    user.avatar = avatarURL;
    await fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2));
    return newAvatarName;
}

export async function uploadBackgroundService(username: string, filePath: string, mimeType: string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8'));
    const user = allUsers.find(u => username === u.username);
    if (!user) throw new ApiError(404,'Пользователь не найден');
    const extention = mimeType.startsWith('video/') ? 'mp4' : 'jpg';
    const newBackgroundName = `${username}.${extention}`;
    const newBackgroundPath = path.join(filePathsObj.userBackgroundPath, newBackgroundName);
    const oldBackground = user.background;
    if (oldBackground) {
        const oldBackgroundPath = path.join(filePathsObj.userBackgroundPath, path.basename(oldBackground));
        await fs.unlink(oldBackgroundPath).catch((err) => 
            console.error(`Ошибка удаления старого фона (${oldBackgroundPath}):`, err)
        );
    }
    await fs.rename(filePath, newBackgroundPath);
    const backgroundURL = `http://localhost:3000/userBackground/${newBackgroundName}`;
    user.background = backgroundURL;
    await fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2));
    return newBackgroundName;
}

export async function deleteAvatarService(username: string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8'));
    const user = allUsers.find(u => username === u.username);
    if (!user) throw new ApiError(404,'Пользователь не найден');
    const avatarPath = user.avatar?.replace('http://localhost:3000/userProfilePicture/', '');
    if (avatarPath) {
        await fs.unlink(path.join(filePathsObj.userProfilePicturePath, avatarPath)).catch(() => {});
    }
    user.avatar = null;
    await fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2));
}

export async function deleteBackgroundService(username: string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8'));
    const user = allUsers.find(u => username === u.username);
    if (!user) throw new ApiError(404,'Пользователь не найден');
    const backgroundPath = user.background?.replace('http://localhost:3000/userBackground/', '');
    if (backgroundPath) {
        await fs.unlink(path.join(filePathsObj.userBackgroundPath, backgroundPath)).catch(() => {});
    }
    user.background = null;
    await fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers, null, 2));
}

export async function getUserRelationsService(username: string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8'));
    const user = allUsers.find(u => username === u.username);
    if (!user) throw new ApiError(404,'Такой пользователь не найден');
    const userSubscribers = allUsers.filter(u => user.userSubscribers.includes(u.username));
    const userSubscribtions = allUsers.filter(u => user.userSubscribtions.includes(u.username));
    return {userSubscribers, userSubscribtions};
}

export async function searchUsersService(query: string) {
    const allUsers: User[] = JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8'));
    return allUsers.filter(u =>  u.username.toLowerCase().startsWith(query.toLowerCase())).slice(0, 3);
}