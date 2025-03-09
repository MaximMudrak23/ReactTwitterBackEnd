import fs from 'fs/promises';
import { filePathsObj } from '../data.path';
import { User } from '../types/userType';
import { Post } from '../types/postType';
import { ApiError } from '../../classes/ApiError';

export async function getPostService(username: string) {
    const [allUsers,allPosts]: [User[],Post[]] = await Promise.all([
        JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.postsPath, 'utf-8'))
    ]);
    const user = allUsers.find(u => username === u.username);
    if (!user) throw new ApiError(404,'Такого пользователя нет');
    const userCreatedPosts = allPosts.filter(p => user.posts.created.includes(p.id)).map(p => ({...p, author: allUsers.find(u => u.username === p.author)}));
    const userLikedPosts = allPosts.filter(p => user.posts.liked.includes(p.id)).map(p => ({...p, author: allUsers.find(u => u.username === p.author)}));
    const userSavedPosts = allPosts.filter(p => user.posts.saved.includes(p.id)).map(p => ({...p, author: allUsers.find(u => u.username === p.author)}));
    return {
        created: userCreatedPosts,
        liked: userLikedPosts,
        saved: userSavedPosts,
    }
}

export async function addPostService(username: string, text: string, id: string) {
    const [allUsers,allPosts]: [User[],Post[]] = await Promise.all([
        JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.postsPath, 'utf-8'))
    ]);
    const newPost: Post = {
        id,
        author: username,
        text,
        createdAt: new Date().toLocaleString('ru-RU'),
        likes: [],
        saves: [],
        isPinned: false,
    }
    allPosts.push(newPost);
    allUsers[allUsers.findIndex(u => username === u.username)].posts.created.push(id);
    await Promise.all([
        fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2)),
        fs.writeFile(filePathsObj.postsPath, JSON.stringify(allPosts,null,2))
    ]);
    return newPost;
}

export async function editPostService(postId: string, newText: string) {
    const allPosts: Post[] = JSON.parse(await fs.readFile(filePathsObj.postsPath, 'utf-8'));
    const post = allPosts.find(p => postId === p.id);
    if (!post) throw new ApiError(404,'Поста с таким айди нет');
    post.text = newText;
    await fs.writeFile(filePathsObj.postsPath, JSON.stringify(allPosts,null,2));
    return post;
}

export async function deletePostService(postId: string) {
    const [allUsers,allPosts]: [User[],Post[]] = await Promise.all([
        JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.postsPath, 'utf-8'))
    ]);
    allUsers.forEach(u => {
        u.posts.created = u.posts.created.filter(x => x !== postId);
        u.posts.liked = u.posts.liked.filter(x => x !== postId);
        u.posts.saved = u.posts.saved.filter(x => x !== postId);
    });
    const allPostsFiltered = allPosts.filter(p => p.id !== postId);
    await Promise.all([
        fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2)),
        fs.writeFile(filePathsObj.postsPath, JSON.stringify(allPostsFiltered,null,2))
    ]);
}

// Тут ничего возвращать не нужно, просто получаю айди и меняю на противоположность тут и на фронте.
export async function pinPostService(postId: string, isPinned: boolean) {
    const allPosts: Post[] = JSON.parse(await fs.readFile(filePathsObj.postsPath, 'utf-8'));
    allPosts[allPosts.findIndex(p => p.id === postId)].isPinned = isPinned;
    await fs.writeFile(filePathsObj.postsPath, JSON.stringify(allPosts,null,2));
    return allPosts[allPosts.findIndex(p => p.id === postId)];
}

// Тут тоже нет смысла возвращать пост, пуст фронт сам это обновляет.
export async function toggleLikeService(postId: string, username: string) {
    const [allUsers,allPosts]: [User[],Post[]] = await Promise.all([
        JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.postsPath, 'utf-8'))
    ]);
    const user = allUsers.find(u => u.username === username);
    const post = allPosts.find(p => p.id === postId);
    if (!post) throw new ApiError(404, "Пост не найден");
    if (!user) throw new ApiError(404, "Пользователь не найден");
    if (post.likes.includes(username)) {
        post.likes = post.likes.filter(x => x !== username);
        user.posts.liked = user.posts.liked.filter(x => x !== postId);
    } else {
        post.likes.push(username);
        user.posts.liked.push(postId);
    }
    await Promise.all([
        fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2)),
        fs.writeFile(filePathsObj.postsPath, JSON.stringify(allPosts,null,2))
    ]);
    return post;
}

export async function toggleSaveService(postId: string, username: string) {
    const [allUsers,allPosts]: [User[],Post[]] = await Promise.all([
        JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.postsPath, 'utf-8'))
    ]);
    const user = allUsers.find(u => u.username === username);
    const post = allPosts.find(p => p.id === postId);
    if (!post) throw new ApiError(404, "Пост не найден");
    if (!user) throw new ApiError(404, "Пользователь не найден");
    if (post.saves.includes(username)) {
        post.saves = post.saves.filter(x => x !== username);
        user.posts.saved = user.posts.saved.filter(x => x !== postId);
    } else {
        post.saves.push(username);
        user.posts.saved.push(postId);
    }
    await Promise.all([
        fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2)),
        fs.writeFile(filePathsObj.postsPath, JSON.stringify(allPosts,null,2))
    ]);
    return post;
}