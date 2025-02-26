import fs from 'fs/promises';
import path from "path";
import { usersPath, userProfilePicturePath, userBackgroundPath } from '../data.path';
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

export async function changeFNService(username:string, userFullName:string) {
    try {
        const users: User[] = JSON.parse(await fs.readFile(usersPath, 'utf-8'));
        const userIndex = users.findIndex(u => u.username === username);

        if(userIndex === -1) {
            throw new Error('Пользователь не найден');
        }

        users[userIndex].fullname = userFullName;
        await fs.writeFile(usersPath, JSON.stringify(users,null,2));
    } catch (error) {
        console.error('Ошибка в сервисе при обновлении имени:', error);
        throw new Error('Ошибка в сервисе при обновлении имени!');
    }
}

export async function uploadAvatarService(username: string, filePath: string, mimeType: string) {
    try {
        const users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));
        const userIndex = users.findIndex(u => u.username === username);

        if (userIndex === -1) {
            throw new Error("Пользователь не найден");
        }

        const ext = mimeType === "image/png" ? "png" : "jpg";
        const newAvatarName = `${username}.${ext}`;
        const newAvatarPath = path.join(userProfilePicturePath, newAvatarName);

        const oldAvatar = users[userIndex].avatar;
        if (oldAvatar) {
            const oldAvatarFileName = path.basename(oldAvatar);
            const oldAvatarPath = path.join(userProfilePicturePath, oldAvatarFileName);
        
            await fs.unlink(oldAvatarPath).catch((err) => {
                console.error(`Ошибка удаления старого аватара (${oldAvatarPath}):`, err);
            });
        }

        await fs.rename(filePath, newAvatarPath);

        const avatarURL = `http://localhost:3000/userProfilePicture/${newAvatarName}`;
        users[userIndex].avatar = avatarURL;
        await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

        return newAvatarName;
    } catch (error) {
        console.error("Ошибка в сервисе загрузки аватара:", error);
        throw new Error("Ошибка загрузки аватара!");
    }
}

export async function uploadBackgroundService(username: string, filePath: string, mimeType: string) {
    try {
        const users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));
        const userIndex = users.findIndex(u => u.username === username);

        if (userIndex === -1) {
            throw new Error("Пользователь не найден");
        }

        const ext = mimeType.startsWith("video/") ? "mp4" : "jpg";
        const newBackgroundName = `${username}.${ext}`;
        const newBackgroundPath = path.join(userBackgroundPath, newBackgroundName);

        const oldBackground = users[userIndex].background;
        if (oldBackground) {
            const oldBackgroundPath = path.join(userBackgroundPath, path.basename(oldBackground));
            await fs.unlink(oldBackgroundPath).catch((err) => 
                console.error(`Ошибка удаления старого фона (${oldBackgroundPath}):`, err)
            );
        }

        await fs.rename(filePath, newBackgroundPath);

        const backgroundURL = `http://localhost:3000/userBackground/${newBackgroundName}`;
        users[userIndex].background = backgroundURL;

        await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

        return newBackgroundName;
    } catch (error) {
        console.error("Ошибка в сервисе загрузки фона:", error);
        throw new Error("Ошибка загрузки фона!");
    }
}

export async function deleteAvatarService(username: string) {
    const users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) throw new Error("Пользователь не найден");

    const avatarPath = users[userIndex].avatar?.replace("http://localhost:3000/userProfilePicture/", "");
    if (avatarPath) {
        await fs.unlink(path.join(userProfilePicturePath, avatarPath)).catch(() => {});
    }

    users[userIndex].avatar = null;
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
}

export async function deleteBackgroundService(username: string) {
    const users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) throw new Error("Пользователь не найден");

    const backgroundPath = users[userIndex].background?.replace("http://localhost:3000/userBackground/", "");
    if (backgroundPath) {
        await fs.unlink(path.join(userBackgroundPath, backgroundPath)).catch(() => {});
    }

    users[userIndex].background = null;
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
}