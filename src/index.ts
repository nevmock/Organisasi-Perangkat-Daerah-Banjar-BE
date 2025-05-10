import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/mongoose';

import perencanaanRoutes from './routes/perencanaanRoutes';
import indikatorRoutes from './routes/indikatorRoutes';
import amplifikasiRoutes from './routes/amplifikasiRoutes'; // ✅ Import ini

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

connectDB();

app.use(express.json());
app.use('/public', express.static('public'));

app.use('/api/perencanaan', perencanaanRoutes);
app.use('/api/indikator', indikatorRoutes);
app.use('/api/amplifikasi', amplifikasiRoutes); // ✅ Register di sini

app.get('/', (_, res) => {
    res.send('API siap jalan 🛠️');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
