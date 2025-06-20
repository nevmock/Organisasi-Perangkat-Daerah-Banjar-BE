import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/mongoose';

import authenticateToken from './middlewares/authMiddleware';

import perencanaanRoutes from './routes/perencanaanRoutes';
import indikatorRoutes from './routes/indikatorRoutes';
import amplifikasiRoutes from './routes/amplifikasiRoutes';
import monitoringRoutes from './routes/monitoringRoutes';
import authRoutes from './routes/authRoutes';
import howRoutes from "./routes/howRoutes";
import doRoutes from "./routes/doRoutes";
import dateRoutes from "./routes/dateRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.info(
    `[${new Date().toISOString()}] Request hit: ${req.method} ${req.originalUrl}`
  );
  next();
});

// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));
app.use(cors())

connectDB().then(() => null);

app.use(express.json());
app.use('/public', express.static('public'));

app.use('/api/auth', authRoutes);
app.use(authenticateToken);

app.use('/api/perencanaan', perencanaanRoutes);
app.use('/api/indikator', indikatorRoutes);
app.use('/api/amplifikasi', amplifikasiRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/how', howRoutes);
app.use('/api/do', doRoutes);
app.use('/api/date', dateRoutes);

app.get('/', (_, res) => {
    res.send('API siap jalan 🛠️');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
