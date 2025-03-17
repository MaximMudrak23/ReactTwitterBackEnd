import path from "path";

export const filePathsObj = {
    usersPath: path.join(__dirname, '../data/users.json'),
    postsPath: path.join(__dirname, '../data/usersPosts.json'),
    chatsPath: path.join(__dirname, '../data/chats/allChats.json'),
    messagesPath: path.join(__dirname, '../data/chats/allMessages.json'),
    userBackgroundPath: path.join(__dirname, '../../express/data/userBackground'),
    userProfilePicturePath: path.join(__dirname, '../../express/data/userProfilePicture'),
}