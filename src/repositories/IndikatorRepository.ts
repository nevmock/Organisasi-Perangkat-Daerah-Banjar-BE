import { IndikatorModel } from '../models/IndikatorModel';
import { PerencanaanModel } from '../models/PerencanaanModel';

export class IndikatorRepository {
    async findAll() {
        return IndikatorModel.find()
            .sort({ createdAt: -1 })
            .populate('id_amplifikasi');
    }

    async findById(id: string) {
        return IndikatorModel.findById(id)
            .populate('id_amplifikasi');
    }

    async findByIds(ids: string[]) {
        return IndikatorModel.find({ _id: { $in: ids } })
            .sort({ createdAt: -1 })
            .populate('id_amplifikasi');
    }

    async create(data: any) {
        return IndikatorModel.create(data);
    }

    async update(id: string, data: any) {
        return IndikatorModel.findByIdAndUpdate(id, data, { new: true });
    }

    async updateIndikator(id: string, data: any) {

        const indikator = await IndikatorModel.findByIdAndUpdate(id, data, { new: true });
        if (!indikator) throw new Error('Indikator tidak ditemukan');
        
        const perencanaan = await PerencanaanModel.findOne({ id_indikator: { $in: [indikator._id] } });
        if (!perencanaan) return indikator;
    
        const semuaIndikator = await IndikatorModel.find({
            _id: { $in: perencanaan.id_indikator }
        });
    
        const unfinished = semuaIndikator.filter(i => i.sudah_selesai === false);
        if (unfinished.length === 0 && !perencanaan.end_date) {
            perencanaan.end_date = new Date();
            await perencanaan.save();
        }
    
        return indikator;
    }  

    async delete(id: string) {
        return IndikatorModel.findByIdAndDelete(id);
    }

    async search(query: string) {
        // Contoh: cari di field indikator_label dan kendala (case-insensitive)
        return IndikatorModel.find({
            $or: [
                { indikator_label: { $regex: query, $options: 'i' } },
                { kendala: { $regex: query, $options: 'i' } }
            ]
        })
        .sort({ createdAt: -1 })
        .populate('id_amplifikasi');
    }
}
