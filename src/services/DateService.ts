import path from 'path';
import fs from 'fs';
import { DateRepository } from '../repositories/DateRepository';

export class DateService {
    private repo = new DateRepository();

    async getAllDate(userId: string, page = 1, limit = 10) {
        return this.repo.findAllByUser(userId, page, limit);
    }

    async getAllDateWithPopulate(userId: string, page = 1, limit = 10) {
        return this.repo.findAllWithPopulateByUser(userId, page, limit);
    }

    async getDate(id: string, userId: string) {
        return this.repo.findById(id, userId);
    }

    async createDate(data: any, userId: string) {
        const existingDate = await this.repo.findByHowId(data.nama_program, userId);
        if (existingDate) {
            throw new Error('Program ini sudah memiliki tanggal. Setiap program hanya boleh memiliki satu tanggal. Silakan perbarui tanggal yang ada jika ingin mengubahnya.');
        }
        return this.repo.create(data, userId);
    }

    async updateDate(id: string, data: any, userId: string) {
        const existing = await this.repo.findByHowId(data.nama_program, userId);
        if (!existing) {
            throw new Error('Data tanggal tidak ditemukan');
        }

        const duplicate = await this.repo.findOne({
            _id: { $ne: id },
            nama_program: data.nama_program ?? existing.nama_program,
            createdBy: userId
        });

        if (duplicate) {
            throw new Error('Program ini sudah memiliki tanggal. Setiap program (How) hanya boleh memiliki satu tanggal.');
        }

        return this.repo.update(id, data, userId);
    }

    async deleteDate(id: string, userId: string) {
        return this.repo.delete(id, userId);
    }

    async searchDate(query: string, userId: string, page = 1, limit = 10) {
        return this.repo.search(query, userId, page, limit);
    }

    async addDokumentasi(id: string, fileUrls: string[], userId: string) {
        return this.repo.uploadFile(id, fileUrls, userId);
    }

    async deleteDokumentasi(dateId: string, userId: string, filename: string) {
        const filePath = await this.repo.removeDokumentasi(dateId, userId, filename);
        if (!filePath) return null;

        const fullPath = path.join('public', filePath);
        fs.unlink(fullPath, err => {
            if (err) console.error('Failed to delete file from disk:', fullPath);
        });

        return true;
    }
}