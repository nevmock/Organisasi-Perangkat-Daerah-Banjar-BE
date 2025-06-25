import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';

const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'dokumentasi');

// Konfigurasi storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(`Destination triggered for file: ${file.originalname}`);
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const finalName = `${uniqueSuffix}${path.extname(file.originalname)}`;
        console.log(`Saving file as: ${finalName}`);
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
        console.log(`File accepted: ${file.originalname}`);
        cb(null, true);
    } else {
        console.log(`File rejected: ${file.originalname}`);
        const error: any = new Error('Hanya file gambar (jpg, jpeg, png) dan PDF yang diizinkan!');
        error.name = 'MulterFileFilterError';
        cb(error);
    }
};

// Inisialisasi multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
        files: 3,
    }
});

// Export upload array dengan limit file 3
export const uploadDokumentasi = upload.array('files', 3);