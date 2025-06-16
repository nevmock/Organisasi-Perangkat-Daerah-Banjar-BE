import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Konfigurasi storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/dokumentasi/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter file: hanya izinkan gambar dan PDF
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype.toLowerCase());

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar (jpg, jpeg, png) dan PDF yang diizinkan!'));
    }
};

// Inisialisasi multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // max 10 MB
});

// Upload multiple (maks 10 file, key: 'files')
export const uploadDokumentasi = upload.array('files', 10);