import path from 'path';
import fs from 'fs';
import { DoModel } from '../models/DoModel';
import { stat, unlink } from 'fs/promises';

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
        const doItem = await DoModel.findOne({ _id: id, createdBy: userId });
        if (!doItem) return false;

        const dokumentasiPaths = doItem.dokumentasi_kegiatan || [];

        for (const fileUrl of dokumentasiPaths) {
        const fullPath = path.join('public', fileUrl);

            try {
                const fileStat = await stat(fullPath);
                if (fileStat.isFile()) {
                await unlink(fullPath);
                console.log(`Deleted file: ${fullPath}`);
                }
            } catch (err: any) {
                if (err.code === 'ENOENT') {
                console.warn(`File not found, skipping: ${fullPath}`);
                } else {
                console.error(`Failed to delete file: ${fullPath}`, err);
                }
            }
        }

        await DoModel.deleteOne({ _id: id, createdBy: userId });
        return true;
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

    async removeDokumentasi(doId: string, userId: string, filename: string) {
        const filePath = `/uploads/dokumentasi/${filename}`;
        const doItem = await DoModel.findOne({ _id: doId, createdBy: userId });
        if (!doItem) return null;

        doItem.dokumentasi_kegiatan = doItem.dokumentasi_kegiatan.filter(path => path !== filePath);
        await doItem.save();

        return filePath;
    }

}