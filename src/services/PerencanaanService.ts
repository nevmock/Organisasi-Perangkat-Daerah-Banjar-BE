import { PerencanaanRepository } from '../repositories/PerencanaanRepository';
import { IndikatorModel } from '../models/IndikatorModel';

export class PerencanaanService {
    private repo = new PerencanaanRepository();

    async getAllPerencanaans() {
        return this.repo.findAll(); // populate
    }

    async getPerencanaan(id: string) {
        return this.repo.findById(id); // populate
    }

    async createPerencanaanWithIndikators(data: {
        nama_program: string,
        opd_pelaksana: string,
        tgl_mulai: Date,
        target: string,
        indikator_labels: string[]
    }) {
        const { indikator_labels, ...perencanaanData } = data;

        const perencanaan = await this.repo.create(perencanaanData);

        const indikatorIds = [];

        for (const label of indikator_labels) {
            const indikator = await IndikatorModel.create({
                indikator_label: label,
                id_perencanaan: perencanaan._id
            });
            indikatorIds.push(indikator._id);
        }

        await perencanaan.updateOne({ $set: { indikators: indikatorIds } });

        return await this.repo.findById(perencanaan._id.toString());

    }

    async updatePerencanaan(id: string, data: any) {
        return this.repo.update(id, data);
    }

    async deletePerencanaan(id: string) {
        return this.repo.delete(id);
    }
}
