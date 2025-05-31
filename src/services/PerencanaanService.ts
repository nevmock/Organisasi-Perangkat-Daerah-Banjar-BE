import { PerencanaanRepository } from '../repositories/PerencanaanRepository';
import { IndikatorModel } from '../models/IndikatorModel';
import { AmplifikasiModel } from '../models/AmplifikasiModel';

export class PerencanaanService {
    private repo = new PerencanaanRepository();

    async getAllPerencanaans() {
        return this.repo.findAll();
    }

    async getAllPerencanaanByAmplifikasi() {
        const allPerencanaan = await this.repo.findAllWithPopulate();
    
        const results = [];
    
        for (const perencanaan of allPerencanaan) {
            const indikatorList = perencanaan.id_indikator || [];
    
            // Ambil semua indikator dari DB (jika id_indikator belum populated)
            const indikatorDocs = await IndikatorModel.find({
                _id: { $in: indikatorList }
            });
    
            const allSelesai = indikatorDocs.length > 0 && indikatorDocs.every(i => i.sudah_selesai === true);
    
            if (allSelesai) {
                results.push(perencanaan);
            }
        }
    
        return results;
    }    

    async getPerencanaan(id: string) {
        return this.repo.findById(id); // populated
    }

    async createPerencanaanWithIndikators(data: {
        nama_program: string,
        opd_pelaksana: string,
        tgl_mulai: Date,
        target: string,
        indikator_labels?: string[]
    }) {
        const { indikator_labels = [], ...perencanaanData } = data;
        const perencanaan = await this.repo.create({ ...perencanaanData, id_indikator: [] });

        const indikatorIds = [];

        for (const label of indikator_labels) {
            const indikator = await IndikatorModel.create({
                indikator_label: label,
                id_perencanaan: perencanaan._id,
                id_amplifikasi: null // sementara null, nanti di-update
            });
        
            const amplifikasi = await AmplifikasiModel.create({
                platform: '',
                caption: '',
                type: '',
                thumbnail: '',
                evidence: [],
                can_edit: false,
                id_perencanaan: perencanaan._id,
                id_indikator: indikator._id
            });
        
            // Update indikator dengan id_amplifikasi setelah amplifikasi dibuat
            await indikator.updateOne({ $set: { id_amplifikasi: amplifikasi._id } });
        
            indikatorIds.push(indikator._id);
        }                

        // Update perencanaan dengan id_indikator[]
        await perencanaan.updateOne({ $set: { id_indikator: indikatorIds } });

        return this.repo.findById(perencanaan._id.toString());
    }

    async updatePerencanaan(id: string, data: any) {
        return this.repo.update(id, data);
    }   

    async deletePerencanaan(id: string) {
        return this.repo.delete(id);
    }

    async searchPerencanaan(query: string) {
        return this.repo.search(query);
    }
}