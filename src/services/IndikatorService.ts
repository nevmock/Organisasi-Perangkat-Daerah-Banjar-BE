import { IndikatorRepository } from '../repositories/IndikatorRepository';
import { deleteEvidenceFile } from '../utils/deleteEvidenceFile';

export class IndikatorService {
    private repo = new IndikatorRepository();

    async getAllIndikators() {
        return this.repo.findAll(); // includes amplifikasi
    }

    async getIndikator(id: string) {
        return this.repo.findById(id);
    }

    async getByIds(ids: string[]) {
        return this.repo.findByIds(ids);
    }

    async createIndikator(data: any) {
        return this.repo.create(data);
    }

    async updateIndikator(id: string, data: any) {
        return this.repo.updateIndikator(id, data);
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

        deleteEvidenceFile(evidenceUrl);

        const updatedEvidence = (indikator.evidence || []).filter(e => e !== evidenceUrl);
        return this.repo.update(indikatorId, { evidence: updatedEvidence });
    }

    async searchIndikator(query: string) {
        return this.repo.search(query);
    }
}