import path from 'path';
import fs from 'fs';
import { DoModel } from '../models/DoModel';
import { stat, unlink } from 'fs/promises';
import mongoose, { PipelineStage, Types } from 'mongoose';

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
        const objectIdUser = new Types.ObjectId(userId);

        // Pipeline stages
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    createdBy: objectIdUser,
                },
            },
            {
                $lookup: {
                    from: 'hows', // collection name of HowModel
                    localField: 'nama_program',
                    foreignField: '_id',
                    as: 'nama_program',
                },
            },
            {
                $unwind: '$nama_program',
            },
            {
                $match: {
                    $or: [
                        { 'nama_program.nama_program': { $regex: query, $options: 'i' } },
                        { 'kolaborator.nama': { $regex: query, $options: 'i' } },
                    ],
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ];

        const countPipeline: PipelineStage[] = [
            {
                $match: {
                    createdBy: objectIdUser,
                },
            },
            {
                $lookup: {
                    from: 'hows',
                    localField: 'nama_program',
                    foreignField: '_id',
                    as: 'nama_program',
                },
            },
            {
                $unwind: '$nama_program',
            },
            {
                $match: {
                    $or: [
                        { 'nama_program.nama_program': { $regex: query, $options: 'i' } },
                        { 'kolaborator.nama': { $regex: query, $options: 'i' } },
                    ],
                },
            },
            {
                $count: 'total',
            },
        ];

        const [data, countResult] = await Promise.all([
            DoModel.aggregate(pipeline),
            DoModel.aggregate(countPipeline),
        ]);

        const total = countResult[0]?.total || 0;

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