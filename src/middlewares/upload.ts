// middlewares/upload.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const uploadEvidence = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            const { id } = req.params; // ID indikator
            const { id_perencanaan } = req.body;

            if (!id_perencanaan) {
                return cb(new Error('id_perencanaan harus disertakan di body'), '');
            }

            const dir = `public/evidence/indikator/${id_perencanaan}/${id}/`;
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            cb(null, `evidence-${timestamp}${ext}`);
        }
    })
});


export const uploadAmplifikasiEvidence = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const { id } = req.params; // ini adalah id amplifikasi

            const dir = `public/evidence/amplifikasi/${id}/`;
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            cb(null, `evidence-${timestamp}${ext}`);
        }
    })
});

export const uploadAmplifikasiThumbnail = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const { id } = req.params; // ini adalah id amplifikasi

            const dir = `public/thumbnail/amplifikasi/${id}/`;
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            cb(null, `thumbnail-${timestamp}${ext}`);
        }
    })
});
