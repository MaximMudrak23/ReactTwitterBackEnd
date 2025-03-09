import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRouter from './routes/user.routes';
import postRouter from './routes/post.routes';
import editRouter from './routes/edit.routes';
import { filePathsObj } from './data.path';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/userBackground', express.static(filePathsObj.userBackgroundPath));
app.use('/userProfilePicture', express.static(filePathsObj.userProfilePicturePath));

app.use('/api', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/edit', editRouter);

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
})