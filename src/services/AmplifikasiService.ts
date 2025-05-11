import { AmplifikasiRepository } from '../repositories/AmplifikasiRepository';
import { PerencanaanModel } from '../models/PerencanaanModel';
import { IndikatorModel } from '../models/IndikatorModel';
import { deleteEvidenceFile } from '../utils/deleteEvidenceFile';

export class AmplifikasiService {
    private repo = new AmplifikasiRepository();

    async getAllAmplifikasis() {
        return this.repo.findAll();
    }

    async getAmplifikasi(id: string) {
        return this.repo.findById(id);
    }

    async updateAmplifikasi(id: string, data: any) {

        const amplifikasi = await this.repo.findById(id);
        if (!amplifikasi) throw new Error('Amplifikasi tidak ditemukan');
    
        // Cari indikator yang memiliki amplifikasi ini
        const indikator = await IndikatorModel.findOne({ id_amplifikasi: id });
        if (!indikator) throw new Error('Indikator tidak ditemukan');
    
        // Cek semua indikator dalam perencanaan
        const perencanaan = await PerencanaanModel.findOne({ id_indikator: indikator._id });
        if (!perencanaan) throw new Error('Perencanaan tidak ditemukan');
    
        const semuaIndikator = await IndikatorModel.find({ _id: { $in: perencanaan.id_indikator } });
        const unfinished = semuaIndikator.filter(i => i.sudah_selesai === false);
    
        if (unfinished.length > 0) {
            throw new Error('Amplifikasi belum bisa diubah karena indikator belum selesai semua');
        }

        return
    }

    async deleteAmplifikasi(id: string) {
        return this.repo.delete(id);
    }

    async addEvidence(id: string, newFiles: string[]) {
        const amplifikasi = await this.repo.findById(id);
        if (!amplifikasi) throw new Error('Amplifikasi tidak ditemukan');

        const updatedEvidence = [...(amplifikasi.evidence || []), ...newFiles];
        return this.repo.update(id, { evidence: updatedEvidence });
    }

    async removeEvidence(amplifikasiId: string, evidenceUrl: string) {
        const amplifikasi = await this.repo.findById(amplifikasiId);
        if (!amplifikasi) throw new Error('Amplifikasi tidak ditemukan');

        deleteEvidenceFile(evidenceUrl);

        const updatedEvidence = (amplifikasi.evidence || []).filter(e => e !== evidenceUrl);
        return this.repo.update(amplifikasiId, { evidence: updatedEvidence });
    }
}
