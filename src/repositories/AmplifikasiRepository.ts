import { AmplifikasiModel } from '../models/AmplifikasiModel';

export class AmplifikasiRepository {
    async findAll() {
        return AmplifikasiModel.find()
            .sort({ createdAt: -1 });
    }

    async findById(id: string) {
        return AmplifikasiModel.findById(id);
    }

    async create(data: any) {
        return AmplifikasiModel.create(data);
    }

    async update(id: string, data: any) {
        return AmplifikasiModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return AmplifikasiModel.findByIdAndDelete(id);
    }

    async search(query: string) {
        // Contoh: cari di field caption dan platform (case-insensitive)
        return AmplifikasiModel.find({
            $or: [
                { caption: { $regex: query, $options: 'i' } },
                { platform: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });
    }
}
