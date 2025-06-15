import mongoose from 'mongoose';

const doSchema = new mongoose.Schema({
    nama_program: { type: String, required: true },

    kolaborator: [{
        nama: { type: String, required: true },
        peran: { type: String, required: true }
    }],

    rincian_kegiatan: { type: String, required: true },
    capaian_output: { type: String, required: true },
    dokumentasi_kegiatan: { type: String },
    kendala: { type: String },
    rekomendasi: { type: String }
}, { timestamps: true });

export const DoModel = mongoose.model('Do', doSchema);
