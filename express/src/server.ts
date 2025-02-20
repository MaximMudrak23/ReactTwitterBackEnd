import express from "express";
import cors from 'cors';
import authRoutes from './routes/auth.routes'
import userRouter from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
})