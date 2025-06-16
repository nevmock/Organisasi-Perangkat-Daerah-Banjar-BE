import { DoModel } from '../models/DoModel';

export class DoRepository {
    async findAllByUser(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            DoModel.find({ createdBy: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            DoModel.countDocuments({ createdBy: userId }),
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
            DoModel.find({ createdBy: userId })
                .populate('nama_program')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            DoModel.countDocuments({ createdBy: userId }),
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

    async search(query: string, userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const filter = {
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
                                { peran: { $regex: query, $options: 'i' } },
                            ]
                        }
                    }
                }
            ]
        };

        const [data, total] = await Promise.all([
            DoModel.find(filter).populate('nama_program').skip(skip).limit(limit).sort({ createdAt: -1 }),
            DoModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    
    async addDokumentasi(id: string, fileUrls: string[], userId: string) {
        const doItem = await DoModel.findOne({ _id: id, createdBy: userId });
        if (!doItem) return null;

        doItem.dokumentasi_kegiatan.push(...fileUrls);
        await doItem.save();
        return doItem;
    }

}