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
        return this.repo.create(data, userId);
    }

    async updateDate(id: string, data: any, userId: string) {
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