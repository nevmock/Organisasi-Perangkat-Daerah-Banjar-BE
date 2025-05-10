import mongoose from 'mongoose';

const amplifikasiSchema = new mongoose.Schema({
    platform: { type: String, required: true },
    caption: { type: String, required: true },
    type: { type: String, required: true },
    evidence: [{ type: String }],
    id_perencanaan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Perencanaan',
        required: true
    }
}, { timestamps: true });

export const AmplifikasiModel = mongoose.model('Amplifikasi', amplifikasiSchema);
