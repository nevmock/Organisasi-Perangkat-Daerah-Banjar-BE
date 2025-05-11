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
}
