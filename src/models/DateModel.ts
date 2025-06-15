import mongoose from 'mongoose';

const dateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nama_program: { type: String, required: true },
    tanggal_mulai: { type: Date, required: true },
    tanggal_selesai: { type: Date, required: true },
    link_laporan_pdf: { type: String },
    status_laporan: { type: String, enum: ['draft', 'final', 'revisi'], required: true }
}, { timestamps: true });

export const DateModel = mongoose.model('Date', dateSchema);
