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
        const posts: Post[] = JSON.parse(await fs.readFile(postsPath, "utf-8"));

        const user = users.find(u => u.username === username);
        if (!user) {
            throw new Error("Пользователь не найден");
        }

        // Функция, которая находит автора и добавляет его данные к посту
        function attachAuthorData(post: Post) {
            const author = users.find(u => u.username === post.author);
            return {
                ...post,
                author: author ? { 
                    username: author.username, 
                    avatar: author.avatar, 
                    fullname: author.fullname, 
                    isUserConfirmed: author.isUserConfirmed, 
                    isUserTwitterCreator: author.isUserTwitterCreator
                } : { username: post.author } // если автора нет в БД, оставляем только ник
            };
        }

        const userPosts = {
            pinned: [],
            created: posts.filter(p => user.posts.created.includes(p.id)).map(attachAuthorData),
            liked: posts.filter(p => user.posts.liked.includes(p.id)).map(attachAuthorData),
            saved: posts.filter(p => user.posts.saved.includes(p.id)).map(attachAuthorData)
        };

        return userPosts;
    } catch (error) {
        console.error("Ошибка при получении постов:", error);
        return { pinned: [], created: [], liked: [], saved: [] };
    }
}

export async function pinPostService(postId: string, isPinned: boolean) {
    try {
        const posts: Post[] = JSON.parse(await fs.readFile(postsPath, "utf-8"));

        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) throw new Error("Пост не найден");

        posts[postIndex].isPinned = isPinned;

        await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));

        return posts[postIndex];
    } catch (error) {
        console.error("Ошибка при закреплении поста:", error);
        throw new Error("Ошибка при закреплении поста");
    }
}

export async function editPostService(postId: string, newText: string) {
    const posts: Post[] = JSON.parse(await fs.readFile(postsPath, "utf-8"));

    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Пост не найден");

    posts[postIndex].text = newText;
    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));

    return posts[postIndex];
}

export async function deletePostService(postId: string) {
    let posts: Post[] = JSON.parse(await fs.readFile(postsPath, "utf-8"));
    let users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));

    posts = posts.filter(post => post.id !== postId);

    users.forEach(user => {
        user.posts.created = user.posts.created.filter(id => id !== postId);
        user.posts.liked = user.posts.liked.filter(id => id !== postId);
        user.posts.saved = user.posts.saved.filter(id => id !== postId);
    });

    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
}

export async function toggleLikeService(postId: string, username: string) {
    try {
        const posts: Post[] = JSON.parse(await fs.readFile(postsPath, "utf-8"));
        const users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));

        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
            throw new Error("Пост не найден");
        }

        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex === -1) {
            throw new Error("Пользователь не найден");
        }

        const post = posts[postIndex];
        const user = users[userIndex];

        if (post.likes.includes(username)) {
            post.likes = post.likes.filter(name => name !== username);
            user.posts.liked = user.posts.liked.filter(id => id !== postId);
        } else {
            post.likes.push(username);
            user.posts.liked.push(postId);
        }

        await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
        await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

        return post;
    } catch (error) {
        console.error("Ошибка при изменении лайка:", error);
        throw new Error("Ошибка при изменении лайка");
    }
}

export async function toggleSaveService(postId: string, username: string) {
    try {
        const posts: Post[] = JSON.parse(await fs.readFile(postsPath, "utf-8"));
        const users: User[] = JSON.parse(await fs.readFile(usersPath, "utf-8"));

        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
            throw new Error("Пост не найден");
        }

        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex === -1) {
            throw new Error("Пользователь не найден");
        }

        const post = posts[postIndex];
        const user = users[userIndex];

        if (post.saves.includes(username)) {
            post.saves = post.saves.filter(name => name !== username);
            user.posts.saved = user.posts.saved.filter(id => id !== postId);
        } else {
            post.saves.push(username);
            user.posts.saved.push(postId);
        }

        await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
        await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

        return post;
    } catch (error) {
        console.error("Ошибка при изменении сохранения:", error);
        throw new Error("Ошибка при изменении сохранения");
    }
}
