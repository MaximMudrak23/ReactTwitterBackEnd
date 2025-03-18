import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRouter from './routes/user.routes';
import postRouter from './routes/post.routes';
import editRouter from './routes/edit.routes';
import chatRouter from './routes/chat.routes';
import { filePathsObj } from './data.path';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use(express.json());
app.use('/userBackground', express.static(filePathsObj.userBackgroundPath));
app.use('/userProfilePicture', express.static(filePathsObj.userProfilePicturePath));

app.use('/api', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/edit', editRouter);
app.use('/api/chat', chatRouter);

io.on('connection', (socket) => {
    // console.log(`User connected: ${socket.id}`);

    socket.on('joinChat', (chatID) => {
        // console.log(`User ${socket.id} connected to chat: ${chatID}`);
        socket.join(chatID);
    });

    socket.on('sendMessage', (message) => {
        // console.log('Message:', {author: message.author, text: message.text});
        io.in(message.chatID).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        // console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});