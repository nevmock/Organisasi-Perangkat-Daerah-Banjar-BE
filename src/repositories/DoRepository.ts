import { DoModel } from '../models/DoModel';
import {HowModel} from "../models/HowModel";

export class DoRepository {
    async findAll() {
        return DoModel.find()
            .sort({ createdAt: -1 });
    }

    async findAllWithPopulate() {
        return DoModel.find()
            .sort({ createdAt: -1 });
    }

    async findById(id: string) {
        return DoModel.findById(id);
    }

    async create(data: any) {
        // const program = new DoModel(data);
        // return program.save();
        return DoModel.create(data)
    }

    async update(id: string, data: any) {
        return DoModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return DoModel.findOneAndDelete({ id });
    }

    async search(query: string) {
        return DoModel.find({
            $or: [
                { nama_program: { $regex: query, $options: 'i' } },
                { rincian_kegiatan: { $regex: query, $options: 'i' } },
                { capaian_output: { $regex: query, $options: 'i' } },
                { dokumentasi_kegiatan: { $regex: query, $options: 'i' } },
                { kendala: { $regex: query, $options: 'i' } },
                { rekomendasi: { $regex: query, $options: 'i' } },
                { kolaborator: { $elemMatch: { nama: { $regex: query, $options: 'i' } } } },
                { kolaborator: { $elemMatch: { peran: { $regex: query, $options: 'i' } } } },
            ]
        }).sort({ createdAt: -1 });
    }
}
