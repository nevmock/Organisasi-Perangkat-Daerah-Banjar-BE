import mongoose from 'mongoose';

const dateSchema = new mongoose.Schema({
    nama_program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'How', // relasi ke HowModel
        required: true
    },
    tanggal_mulai: { type: Date, required: true },
    tanggal_selesai: { type: Date, required: true },
    link_laporan_pdf: {
        type: [String], // jadi array of string
        default: []
    },
    status_laporan: {
        type: String,
        enum: ['draft', 'final', 'revisi'],
        required: true,
        default: 'draft'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const DateModel = mongoose.model('Date', dateSchema);