import { DoModel } from '../models/DoModel';

export class DoRepository {
    async findAllByUser(userId: string) {
        return DoModel.find({ createdBy: userId }).sort({ createdAt: -1 });
    }

    async findAllWithPopulateByUser(userId: string) {
        return DoModel.find({ createdBy: userId })
            .populate('nama_program')
            .sort({ createdAt: -1 });
    }

    async findById(id: string, userId: string) {
        return DoModel.findOne({ _id: id, createdBy: userId }).populate('nama_program');
    }

    async create(data: any, userId: string) {
        return DoModel.create({ ...data, createdBy: userId });
    }

    async update(id: string, data: any, userId: string) {
        return DoModel.findOneAndUpdate(
            { _id: id, createdBy: userId },
            data,
            { new: true }
        );
    }

    async delete(id: string, userId: string) {
        return DoModel.findOneAndDelete({ _id: id, createdBy: userId });
    }

    async search(query: string, userId: string) {
        return DoModel.find({
            createdBy: userId,
            $or: [
                { rincian_kegiatan: { $regex: query, $options: 'i' } },
                { capaian_output: { $regex: query, $options: 'i' } },
                { dokumentasi_kegiatan: { $regex: query, $options: 'i' } },
                { kendala: { $regex: query, $options: 'i' } },
                { rekomendasi: { $regex: query, $options: 'i' } },
                {
                    kolaborator: {
                        $elemMatch: {
                            $or: [
                                { nama: { $regex: query, $options: 'i' } },
                                { peran: { $regex: query, $options: 'i' } }
                            ]
                        }
                    }
                }
            ]
        }).populate('nama_program').sort({ createdAt: -1 });
    }
}