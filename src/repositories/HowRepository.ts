import { HowModel } from '../models/HowModel';

export class HowRepository {

    async findAllByUser(userId: string, page = 1, limit = 10, withPagination = true) {
        if (!withPagination) {
            const data = await HowModel.find({ createdBy: userId }).sort({ createdAt: -1 });
            return {
                data,
                total: data.length,
            };
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            HowModel.find({ createdBy: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            HowModel.countDocuments({ createdBy: userId }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findAllWithPopulateByUser(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            HowModel.find({ createdBy: userId })
                .populate('createdBy', 'email unit')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            HowModel.countDocuments({ createdBy: userId }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
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

    async search(query: string, userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const filter = {
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
            ],
        };

        const [data, total] = await Promise.all([
            HowModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            HowModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}