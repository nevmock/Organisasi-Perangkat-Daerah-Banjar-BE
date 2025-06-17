import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function handleMulterError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    let message = 'Terjadi kesalahan saat mengunggah berkas.';

    switch (err.code) {
    case 'LIMIT_FILE_SIZE':
        message = 'Ukuran berkas terlalu besar. Silakan unggah berkas dengan ukuran yang sesuai.';
        break;
    case 'LIMIT_FILE_COUNT':
        message = 'Terlalu banyak berkas diunggah. Silakan unggah sesuai jumlah yang diperbolehkan.';
        break;
    case 'LIMIT_UNEXPECTED_FILE':
        message = 'Berkas tidak dikenali. Silakan periksa kembali nama field pada formulir unggahan Anda.';
        break;
    default:
        message = err.message || message;
        break;
    }

    return res.status(400).json({ message });

    } else if (err) {
    return res.status(500).json({
        message: 'Terjadi kesalahan pada server saat mengunggah berkas. Silakan coba lagi nanti.'
    });
    }

    next();
}
