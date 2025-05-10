import { AmplifikasiRepository } from '../repositories/AmplifikasiRepository';
import { IndikatorModel } from '../models/IndikatorModel';
import { deleteEvidenceFile } from '../utils/deleteEvidenceFile';

export class AmplifikasiService {
    private repo = new AmplifikasiRepository();

    async getAllAmplifikasis() {
        return this.repo.findAll(); // with populate
    }

    async getAmplifikasi(id: string) {
        return this.repo.findById(id);
    }

    async getByPerencanaan(perencanaanId: string) {
        return this.repo.findByPerencanaan(perencanaanId);
    }

    async createAmplifikasi(data: any) {
        const { id_perencanaan } = data;

        // Cek apakah semua indikator sudah selesai
        const unfinished = await IndikatorModel.countDocuments({
            id_perencanaan,
            sudah_selesai: false
        });

        if (unfinished > 0) {
            throw new Error('Tidak bisa membuat amplifikasi: masih ada indikator yang belum selesai');
        }

        return this.repo.create(data);
    }

    async updateAmplifikasi(id: string, data: any) {
        return this.repo.update(id, data);
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
