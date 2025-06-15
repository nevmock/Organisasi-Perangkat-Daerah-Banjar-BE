import { DateModel } from '../models/DateModel';

export class DateRepository {
    async findAll() {
        return DateModel.find()
            .sort({ createdAt: -1 });
    }

    async findAllWithPopulate() {
        return DateModel.find()
            .sort({ createdAt: -1 });
    }

    async findById(id: string) {
        return DateModel.findById(id);
    }

    async create(data: any) {
        const program = new DateModel(data);
        return program.save();
    }

    async update(id: string, data: any) {
        return DateModel.findOneAndUpdate({ id }, data, { new: true });
    }

    async delete(id: string) {
        return DateModel.findOneAndDelete({ id });
    }

    async search(query: string) {
        return DateModel.find({
            $or: [
                { nama_program: { $regex: query, $options: 'i' } },
                { status_laporan: { $regex: query, $options: 'i' } },
                { link_laporan_pdf: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });
    }
}
