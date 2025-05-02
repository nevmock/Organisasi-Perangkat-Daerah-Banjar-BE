import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/mongoose';
import perencanaanRoutes from './routes/perencanaanRoutes';
import indikatorRoutes from './routes/indikatorRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // Untuk sementara, izinkan semua origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
connectDB();

app.use('/api/perencanaan', perencanaanRoutes);
app.use('/api/indikator', indikatorRoutes);

app.get('/', (_, res) => {
    res.send('API siap jalan 🛠️');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
