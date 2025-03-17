import fs from 'fs/promises';
import { filePathsObj } from '../data.path';
import { User } from '../types/userType';
import { Chat } from '../types/chatType';
import { Message } from '../types/messageType';
import { ApiError } from '../../classes/ApiError';

export async function getAllChatsService(username: string) {
    const [allUsers, allChats, allMessages]: [User[], Chat[], Message[]] = await Promise.all([
        JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.chatsPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.messagesPath, 'utf-8'))
    ]);
    const user = allUsers.find(u => username === u.username);
    if (!user) throw new ApiError(404,'Такого пользователя нет');
    const userChats = allChats.filter(c => c.users.includes(username));
    const chatFullData = userChats.map(c => {
        const chatPartner = c.users.find(u => u !== username);
        const chatPartnerData = allUsers.find(u => chatPartner === u.username);
        const lastMessageID = c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
        const lastMessage = lastMessageID ? allMessages.find(m => m.id === lastMessageID) : null;
        return {
            id: c.id,
            interlocutor: chatPartnerData,
            lastMessage: lastMessage ? {text: lastMessage.text, author: lastMessage.author, date: lastMessage.date} : null,
        };
    });
    return chatFullData;
}

export async function openChatService(initiatorUsername: string, targetUsername: string) {
    const [allChats, allUsers]: [Chat[], User[]] = await Promise.all([
        JSON.parse(await fs.readFile(filePathsObj.chatsPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8'))
    ]);
    const initiatorObj = allUsers.find(u => initiatorUsername === u.username);
    const targetObj = allUsers.find(u => targetUsername === u.username);
    if (!initiatorObj || !targetObj) throw new ApiError(404,'Кого-то из пользователей не существует');
    const existingChat = allChats.find(c => c.users.includes(initiatorUsername) && c.users.includes(targetUsername));
    const alphabetSort = [initiatorUsername, targetUsername].sort();
    if (existingChat) {
        return existingChat.id;
    }
    const newChat: Chat = {
        id: `${alphabetSort[0]}_${alphabetSort[1]}_${Date.now()}`,
        users: alphabetSort,
        messages: [],
    }
    allChats.push(newChat);
    initiatorObj.chats.push(newChat.id);
    targetObj.chats.push(newChat.id);
    await Promise.all([
        fs.writeFile(filePathsObj.chatsPath, JSON.stringify(allChats,null,2)),
        fs.writeFile(filePathsObj.usersPath, JSON.stringify(allUsers,null,2))
    ]);
    return newChat.id;
}

export async function getFullChatService(chatID: string) {
    const [allUsers, allChats, allMessages]: [User[], Chat[], Message[]] = await Promise.all([
        JSON.parse(await fs.readFile(filePathsObj.usersPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.chatsPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.messagesPath, 'utf-8'))
    ]);
    const chat = allChats.find(c => chatID === c.id);
    if (!chat) throw new ApiError(404, 'Чат не найден');
    const [user1, user2] = chat.users;
    const user1Data = allUsers.find(u => u.username === user1);
    const user2Data = allUsers.find(u => u.username === user2);
    if (!user1Data || !user2Data) throw new ApiError(404, 'Пользователь не найден');
    const chatMessages = allMessages.filter(m => chat.messages.includes(m.id));
    return {
        id: chat.id,
        users: [
            {
                username: user1Data.username,
                fullname: user1Data.fullname,
                avatar: user1Data.avatar
            },
            {
                username: user2Data.username,
                fullname: user2Data.fullname,
                avatar: user2Data.avatar
            }
        ],
        messages: chatMessages
    };
}

export async function sendMessageService(chatID: string, author: string, text: string, date: string, isRead: boolean) {
    const [allChats, allMessages]: [Chat[], Message[]] = await Promise.all([
        JSON.parse(await fs.readFile(filePathsObj.chatsPath, 'utf-8')),
        JSON.parse(await fs.readFile(filePathsObj.messagesPath, 'utf-8'))
    ]);
    const chat = allChats.find(c => chatID === c.id);
    if (!chat) throw new ApiError(404,'Чат не найден');
    const sortedUsers = chat.users.sort();
    const newMessage: Message = {
        id: `msg_${sortedUsers[0]}_${sortedUsers[1]}_${Date.now()}`,
        author,
        text,
        date,
        isRead,
    }
    chat.messages.push(newMessage.id);
    allMessages.push(newMessage);
    await Promise.all([
        fs.writeFile(filePathsObj.chatsPath, JSON.stringify(allChats,null,2)),
        fs.writeFile(filePathsObj.messagesPath, JSON.stringify(allMessages,null,2))
    ]);
    return newMessage;
}