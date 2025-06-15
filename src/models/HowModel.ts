import mongoose from 'mongoose';

const howSchema = new mongoose.Schema({
    nama_program: { type: String, required: true },
    tujuan_program: { type: String, required: true },
    sasaran_program: { type: String, required: true },
    rencana_output: {
        kuantitatif: [{ type: String }],
        kualitatif: [{ type: String }]
    },
    target_indikator_kinerja: {
        jumlah_peserta: { type: Number, required: true },
        jumlah_pelatihan: { type: Number, required: true },
        tingkat_kepuasan: { type: String, required: true }
    },
    rencana_lokasi: {
        kelurahan: { type: String, required: true },
        kecamatan: { type: String, required: true },
        kota: { type: String, required: true }
    },
    rencana_anggaran: {
        jumlah: { type: Number },
        sumber_dana: [{
            jenis: { type: String },
            persentase: { type: Number }
        }]
    },
    opd_pengusul_utama: { type: String, required: true },
    opd_kolaborator: [{ type: String }]
}, { timestamps: true });

export const HowModel = mongoose.model('How', howSchema);
