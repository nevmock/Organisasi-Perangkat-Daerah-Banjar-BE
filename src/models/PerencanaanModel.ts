import mongoose from 'mongoose';

const perencanaanSchema = new mongoose.Schema({
    nama_program: { type: String, required: true },
    opd_pelaksana: { type: String, required: true },
    tgl_mulai: { type: Date, required: true },
    target: { type: String, required: true },
    end_date: { type: Date, default: null },
    
    id_indikator: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Indikator',
        required: true
    }]
}, { timestamps: true });

export const PerencanaanModel = mongoose.model('Perencanaan', perencanaanSchema);
