import { IndikatorModel } from '../models/IndikatorModel';
import { PerencanaanModel } from '../models/PerencanaanModel';

export class IndikatorRepository {
    async findAll() {
        return IndikatorModel.find().sort({ createdAt: -1 }).populate('id_perencanaan');
    }

    async findById(id: string) {
        return IndikatorModel.findById(id).populate('id_perencanaan');
    }

    async create(data: any) {
        const indikator = await IndikatorModel.create(data);

        // Push ID indikator ke parent Perencanaan
        await PerencanaanModel.findByIdAndUpdate(indikator.id_perencanaan, {
            $push: { indikators: indikator._id }
        });

        return indikator;
    }

    async update(id: string, data: any) {
        return IndikatorModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        const indikator = await IndikatorModel.findByIdAndDelete(id);

        // Hapus referensinya dari Perencanaan jika ada
        if (indikator) {
            await PerencanaanModel.findByIdAndUpdate(indikator.id_perencanaan, {
                $pull: { indikators: indikator._id }
            });
        }

        return indikator;
    }
}
