import mongoose from 'mongoose';

const perencanaanSchema = new mongoose.Schema({
    nama_program: { type: String, required: true },
    opd_pelaksana: { type: String, required: true },
    tgl_mulai: { type: Date, required: true },
    target: { type: String, required: true },
    indikators: { type: [String], required: true },
}, { timestamps: true });

export const PerencanaanModel = mongoose.model('Perencanaan', perencanaanSchema);
