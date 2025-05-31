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
    
        return this.repo.update(id, data);
    }    

    async deleteAmplifikasi(id: string) {
        return this.repo.delete(id);
    }

    async addEvidence(id: string, newUrls: string[]) {
        const amplifikasi = await this.repo.findById(id);
        if (!amplifikasi) throw new Error('Amplifikasi tidak ditemukan');

        const updatedEvidence = [...(amplifikasi.evidence || []), ...newUrls];
        return this.repo.update(id, { evidence: updatedEvidence });
    }

    async addThumbnail(id: string, newUrls: string[]) {
        const amplifikasi = await this.repo.findById(id);
        if (!amplifikasi) throw new Error('Amplifikasi tidak ditemukan');

        const updatedThumbnail = [...(amplifikasi.thumbnail || []), ...newUrls];
        return this.repo.update(id, { thumbnail: updatedThumbnail });
    }

    async removeEvidence(amplifikasiId: string, evidenceUrl: string) {
        const amplifikasi = await this.repo.findById(amplifikasiId);
        if (!amplifikasi) throw new Error('Amplifikasi tidak ditemukan');

        deleteEvidenceFile(evidenceUrl);

        const updatedEvidence = (amplifikasi.evidence || []).filter(e => e !== evidenceUrl);
        return this.repo.update(amplifikasiId, { evidence: updatedEvidence });
    }

    async searchAmplifikasi(query: string) {
        return this.repo.search(query);
    }
}
