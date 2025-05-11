import mongoose from 'mongoose';

const amplifikasiSchema = new mongoose.Schema({
    platform: { type: String},
    thumbnail: [{ type: String }],
    evidence: [{ type: String }],
    caption: { type: String},
    type: { type: String},
    sudah_dipost: { type: Boolean, default: false },
    
    id_indikator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Indikator',
        required: true
    },
    id_perencanaan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Perencanaan',
        required: true
    }

}, { timestamps: true });

export const AmplifikasiModel = mongoose.model('Amplifikasi', amplifikasiSchema);
