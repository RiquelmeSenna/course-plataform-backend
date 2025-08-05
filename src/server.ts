import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import authRouter from './routers/authRouter';
import categoryRouter from './routers/categoryRouter';
import coursersRouter from './routers/courserRouter';
import "./types/requestType"
import moduleRouter from './routers/moduleRouter';
import videoRouter from './routers/videoRouter';
import userRouter from './routers/usersRouter';
import enrollmentRouter from './routers/enrollmentRouter';
import webHookRouter from './routers/webHookRouter';
import ratingRouter from './routers/ratingRouter';
import path from 'path';

const server = express();
const port = process.env.PORT || 4000;

// ✅ Habilita CORS para o Live Server (sem duplicar)
server.use(cors())

server.use('/webhook', webHookRouter)
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(helmet({
    crossOriginResourcePolicy: false
}));

server.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
    setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
    }
}));

// ✅ Serve imagens
server.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
    setHeaders: (res, path, stat) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); // ou 'http://127.0.0.1:5500' se quiser ser mais restrito
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
}));

// Serve arquivos públicos se precisar
server.use(express.static('public'));

// Rotas
server.use('/auth', authRouter);
server.use('/categories', categoryRouter);
server.use('/courses', coursersRouter);
server.use('/modules', moduleRouter);
server.use('/videos', videoRouter);
server.use('/users', userRouter);
server.use('/enrollments', enrollmentRouter);
server.use('/ratings', ratingRouter);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});