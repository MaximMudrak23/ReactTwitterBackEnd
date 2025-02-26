import express from "express";
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRouter from './routes/user.routes';
import postRouter from './routes/post.routes';
import { userBackgroundPath, userProfilePicturePath } from './data.path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/userBackground', express.static(userBackgroundPath));
app.use('/userProfilePicture', express.static(userProfilePicturePath));

app.use('/api', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
})