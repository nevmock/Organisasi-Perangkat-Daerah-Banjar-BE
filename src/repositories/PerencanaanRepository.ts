import { PerencanaanModel } from '../models/PerencanaanModel';

export class PerencanaanRepository {
    async findAll() {
        return PerencanaanModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'id_indikator',
                populate: {
                    path: 'id_amplifikasi'
                }
            });
    }

    async findAllWithPopulate() {
        return PerencanaanModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'id_indikator',
                populate: {
                    path: 'id_amplifikasi'
                }
            });
    }    

    async findById(id: string) {
        return PerencanaanModel.findById(id)
            .populate({
                path: 'id_indikator',
                populate: {
                    path: 'id_amplifikasi'
                }
            });
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

    async search(query: string) {
        // Contoh: cari di field nama_program dan opd_pelaksana (case-insensitive)
        return PerencanaanModel.find({
            $or: [
                { nama_program: { $regex: query, $options: 'i' } },
                { opd_pelaksana: { $regex: query, $options: 'i' } }
            ]
        })
        .sort({ createdAt: -1 })
        .populate({
            path: 'id_indikator',
            populate: {
                path: 'id_amplifikasi'
            }
        });
    }
}
