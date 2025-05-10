import mongoose from 'mongoose';

const indikatorSchema = new mongoose.Schema({
    indikator_label: { type: String, required: true },
    sudah_selesai: { type: Boolean, default: false },
    evidence: [{ type: String }],
    kendala: { type: String },
    kesimpulan_tindakan: { type: String },
    id_perencanaan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Perencanaan',
        required: true
    }
}, { timestamps: true });

export const IndikatorModel = mongoose.model('Indikator', indikatorSchema);
