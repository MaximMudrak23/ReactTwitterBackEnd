import fs from "fs/promises";
import { usersPath, postsPath } from "../data.path";
import { User } from "../types/userType";
import { Post } from "../types/postType";

export async function addPostService(text: string, username: string, id: string) {
    try {
        const posts: Post[] = JSON.parse(await fs.readFile(postsPath, "utf-8"));
        const users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));

        const newPost: Post = {
            id,
            author: username,
            text,
            createdAt: new Date().toISOString(),
            likes: [],
            saves: [],
            isPinned: false,

        };

        posts.push(newPost);
        await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));

        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            users[userIndex].posts.created.unshift(id);
            await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
        } else {
            console.error("Пользователь не найден!");
        }

        return newPost;
    } catch (error) {
        console.error("Ошибка при добавлении поста:", error);
        throw new Error("Ошибка при добавлении поста");
    }
}

export async function getPostService(username: string) {
    try {
        const users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));
        const user = users.find(u => u.username === username);
        if (!user) {
            throw new Error("Пользователь не найден");
        }

        const posts: Post[] = JSON.parse(await fs.readFile(postsPath, "utf-8"));
        const userPosts = {
            pinned: [],
            created: posts.filter(p => user.posts.created.includes(p.id)),
            liked: posts.filter(p => user.posts.liked.includes(p.id)),
            saved: posts.filter(p => user.posts.saved.includes(p.id))
        };

        return userPosts;
    } catch (error) {
        console.error("Ошибка при получении постов:", error);
        return { pinned: [], created: [], liked: [], saved: [] };
    }
}