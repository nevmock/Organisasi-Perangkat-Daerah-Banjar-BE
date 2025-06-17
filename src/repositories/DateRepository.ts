import path from 'path';
import { DateModel } from '../models/DateModel';
import { stat, unlink } from 'fs/promises';

export class DateRepository {
    async findAllByUser(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            DateModel.find({ createdBy: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            DateModel.countDocuments({ createdBy: userId }),
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
            DateModel.find({ createdBy: userId })
                .populate('nama_program')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            DateModel.countDocuments({ createdBy: userId }),
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
        const dateItem = await DateModel.findOne({ _id: id, createdBy: userId });
        if (!dateItem) return false;

        const laporanPaths = dateItem.link_laporan_pdf || [];

        for (const fileUrl of laporanPaths) {
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

        await DateModel.deleteOne({ _id: id, createdBy: userId });
        return true;
    }

    async search(query: string, userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const filter = {
            createdBy: userId,
            $or: [
                { status_laporan: { $regex: query, $options: 'i' } },
                { link_laporan_pdf: { $elemMatch: { $regex: query, $options: 'i' } } },
            ],
        };

        const [data, total] = await Promise.all([
            DateModel.find(filter)
                .populate('nama_program')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            DateModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async uploadFile(id: string, userId: string, files: Express.Multer.File[]) {
        const filePaths = files.map((file) => {
            const filename = path.basename(file.path); // extract filename only
            return `/uploads/dokumentasi/${filename}`;
        });

        return DateModel.findOneAndUpdate(
            { _id: id, createdBy: userId },
            { $push: { link_laporan_pdf: { $each: filePaths } } },
            { new: true }
        );
    }

    async removeDokumentasi(dateId: string, userId: string, filename: string) {
        const filePath = `/uploads/dokumentasi/${filename}`;
        const dateItem = await DateModel.findOne({ _id: dateId, createdBy: userId });
        if (!dateItem) return null;

        dateItem.link_laporan_pdf = dateItem.link_laporan_pdf.filter(path => path !== filePath);
        await dateItem.save();

        return filePath;
    }

}
