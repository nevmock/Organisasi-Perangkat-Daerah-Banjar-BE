import { HowModel } from '../models/HowModel';

export class HowRepository {
    async findAll() {
        return HowModel.find()
            .sort({ createdAt: -1 });
    }

    async findAllWithPopulate() {
        return HowModel.find()
            // ganti 'createdBy' jika ada referensi di future
            .sort({ createdAt: -1 });
    }

    async findById(id: string) {
        return HowModel.findById(id);
    }

    async create(data: any) {
        const how = new HowModel(data);
        return how.save();
    }

    async update(id: string, data: any) {
        return HowModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return HowModel.findOneAndDelete({ id });
    }

    async search(query: string) {
        return HowModel.find({
            $or: [
                { nama_program: { $regex: query, $options: 'i' } },
                { tujuan_program: { $regex: query, $options: 'i' } },
                { sasaran_program: { $regex: query, $options: 'i' } },
                { 'rencana_lokasi.kelurahan': { $regex: query, $options: 'i' } },
                { 'rencana_lokasi.kecamatan': { $regex: query, $options: 'i' } },
                { 'rencana_lokasi.kota': { $regex: query, $options: 'i' } },
                { opd_pengusul_utama: { $regex: query, $options: 'i' } },
                { opd_kolaborator: { $elemMatch: { $regex: query, $options: 'i' } } },
            ]
        }).sort({ createdAt: -1 });
    }
}
