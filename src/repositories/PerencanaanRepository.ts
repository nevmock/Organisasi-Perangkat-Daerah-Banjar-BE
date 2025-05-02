import { PerencanaanModel } from '../models/PerencanaanModel';

export class PerencanaanRepository {
    async findAll() {
        return PerencanaanModel.find().sort({ createdAt: -1 }).populate('indikators');
    }

    async findById(id: string) {
        return PerencanaanModel.findById(id).populate('indikators');
    }

    async create(data: any) {
        return PerencanaanModel.create(data);
    }

    async update(id: string, data: any) {
        return PerencanaanModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return PerencanaanModel.findByIdAndDelete(id);
    }
}
