import { DateModel } from '../models/DateModel';

export class DateRepository {
    async findAllByUser(userId: string) {
        return DateModel.find({ createdBy: userId })
            .sort({ createdAt: -1 });
    }

    async findAllWithPopulateByUser(userId: string) {
        return DateModel.find({ createdBy: userId })
            .populate('nama_program')
            .sort({ createdAt: -1 });
    }

    async findById(id: string, userId: string) {
        return DateModel.findOne({ _id: id, createdBy: userId })
            .populate('nama_program');
    }

    async create(data: any, userId: string) {
        return DateModel.create({ ...data, createdBy: userId });
    }

    async update(id: string, data: any, userId: string) {
        return DateModel.findOneAndUpdate(
            { _id: id, createdBy: userId },
            data,
            { new: true }
        );
    }

    async delete(id: string, userId: string) {
        return DateModel.findOneAndDelete({ _id: id, createdBy: userId });
    }

    async search(query: string, userId: string) {
        return DateModel.find({
            createdBy: userId,
            $or: [
                { status_laporan: { $regex: query, $options: 'i' } },
                { link_laporan_pdf: { $elemMatch: { $regex: query, $options: 'i' } } }
            ]
        })
        .populate('nama_program')
        .sort({ createdAt: -1 });
    }
}