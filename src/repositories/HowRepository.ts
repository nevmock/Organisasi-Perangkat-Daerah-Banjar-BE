import { HowModel } from '../models/HowModel';

export class HowRepository {
    async findAllByUser(userId: string) {
        return HowModel.find({ createdBy: userId }).sort({ createdAt: -1 });
    }

    async findAllWithPopulateByUser(userId: string) {
        return HowModel.find({ createdBy: userId })
            .populate('createdBy', 'email unit') // populate user info
            .sort({ createdAt: -1 });
    }

    async findById(id: string, userId: string) {
        return HowModel.findOne({ _id: id, createdBy: userId });
    }

    async create(data: any, userId: string) {
        return HowModel.create({ ...data, createdBy: userId });
    }

    async update(id: string, data: any, userId: string) {
        return HowModel.findOneAndUpdate(
            { _id: id, createdBy: userId },
            data,
            { new: true }
        );
    }

    async delete(id: string, userId: string) {
        return HowModel.findOneAndDelete({ _id: id, createdBy: userId });
    }

    async search(query: string, userId: string) {
        return HowModel.find({
            createdBy: userId,
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