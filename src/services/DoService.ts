import path from 'path';
import fs from 'fs';
import { DoRepository } from '../repositories/DoRepository';

export class DoService {
    private repo = new DoRepository();

    async getAllDo(userId: string, page: number = 1, limit: number = 10) {
        return this.repo.findAllByUser(userId, page, limit);
    }

    async getAllDoWithPopulate(userId: string, page: number = 1, limit: number = 10) {
        return this.repo.findAllWithPopulateByUser(userId, page, limit);
    }

    async getDo(id: string, userId: string) {
        return this.repo.findById(id, userId);
    }

    async createDoWithIndikators(data: any, userId: string) {
        return this.repo.create(data, userId);
    }

    async updateDo(id: string, data: any, userId: string) {
        return this.repo.update(id, data, userId);
    }

    async deleteDo(id: string, userId: string) {
        return this.repo.delete(id, userId);
    }

    async searchDo(query: string, userId: string, page: number = 1, limit: number = 10) {
        return this.repo.search(query, userId, page, limit);
    }

    async addDokumentasi(id: string, fileUrls: string[], userId: string) {
        return this.repo.addDokumentasi(id, fileUrls, userId);
    }

    async deleteDokumentasi(doId: string, userId: string, filename: string) {
        const filePath = await this.repo.removeDokumentasi(doId, userId, filename);
        if (!filePath) return null;

        const fullPath = path.join('public', filePath);
        fs.unlink(fullPath, err => {
            if (err) console.error('Failed to delete file from disk:', fullPath);
        });

        return true;
    }
}