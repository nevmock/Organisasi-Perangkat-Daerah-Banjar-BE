import { IndikatorRepository } from '../repositories/IndikatorRepository';

export class IndikatorService {
    private repo = new IndikatorRepository();

    async getAllIndikators() {
        return this.repo.findAll(); // with populate
    }

    async getIndikator(id: string) {
        return this.repo.findById(id);
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

    async addEvidence(id: string, newFiles: string[]) {
        const indikator = await this.repo.findById(id);
        if (!indikator) throw new Error('Indikator not found');

        const updatedEvidence = [...(indikator.evidence || []), ...newFiles];

        return this.repo.update(id, { evidence: updatedEvidence });
    }
}
