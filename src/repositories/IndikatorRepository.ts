import { IndikatorModel } from '../models/IndikatorModel';

export class IndikatorRepository {
    async findAll() {
        return IndikatorModel.find()
            .sort({ createdAt: -1 })
            .populate('id_perencanaan');
    }

    async findById(id: string) {
        return IndikatorModel.findById(id)
            .populate('id_perencanaan');
    }

    async findByPerencanaan(perencanaanId: string) {
        return IndikatorModel.find({ id_perencanaan: perencanaanId })
            .sort({ createdAt: -1 });
    }

    async create(data: any) {
        return IndikatorModel.create(data);
    }

    async update(id: string, data: any) {
        return IndikatorModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return IndikatorModel.findByIdAndDelete(id);
    }
}
