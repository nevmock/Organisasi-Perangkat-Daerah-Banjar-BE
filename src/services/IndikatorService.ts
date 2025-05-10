import { IndikatorRepository } from '../repositories/IndikatorRepository';
import { deleteEvidenceFile } from '../utils/deleteEvidenceFile';

export class IndikatorService {
    private repo = new IndikatorRepository();

    async getAllIndikators() {
        return this.repo.findAll(); // includes populate
    }

    async getIndikator(id: string) {
        return this.repo.findById(id);
    }

    async getByPerencanaan(perencanaanId: string) {
        return this.repo.findByPerencanaan(perencanaanId);
    }

    async createIndikator(data: any) {
        return this.repo.create(data);
    }

    async updateIndikator(id: string, data: any) {
        return this.repo.update(id, data);
    }

    async deleteIndikator(id: string) {
        return this.repo.delete(id);
    }

    async addEvidence(id: string, newUrls: string[]) {
        const indikator = await this.repo.findById(id);
        if (!indikator) throw new Error('Indikator tidak ditemukan');

        const updatedEvidence = [...(indikator.evidence || []), ...newUrls];
        return this.repo.update(id, { evidence: updatedEvidence });
    }

    async removeEvidence(indikatorId: string, evidenceUrl: string) {
        const indikator = await this.repo.findById(indikatorId);
        if (!indikator) throw new Error('Indikator tidak ditemukan');

        // Hapus dari file system
        deleteEvidenceFile(evidenceUrl);

        // Update DB
        const updatedEvidence = (indikator.evidence || []).filter(e => e !== evidenceUrl);
        return this.repo.update(indikatorId, { evidence: updatedEvidence });
    }

}
