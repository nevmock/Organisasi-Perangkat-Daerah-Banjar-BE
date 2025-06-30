import { DateModel } from '../models/DateModel';
import { DoModel } from '../models/DoModel';
import { HowRepository } from '../repositories/HowRepository';

export class HowService {
    private repo = new HowRepository();

    async getAllHowByUser(userId: string, page: number, limit: number, withPagination = true) {
        return this.repo.findAllByUser(userId, page, limit, withPagination);
    }
    
    async getAllHowWithPopulateByUser(userId: string, page: number, limit: number) {
        return this.repo.findAllWithPopulateByUser(userId, page, limit);
    }
    
    async getDoDateDetailsByHowIdAdmin(howId: string) {
        return this.repo.getDoDateDetailsByHowIdAdmin(howId);
    }

    async getHow(id: string, userId: string) {
        return this.repo.findById(id, userId);
    }

    async createHowWithIndikators(data: any, userId: string) {
        return this.repo.create(data, userId);
    }

    async updateHow(id: string, data: any, userId: string) {
        return this.repo.update(id, data, userId);
    }

    async deleteHow(id: string, userId: string) {
        // Pastikan data How milik user
        const how = await this.repo.findById(id, userId)
        if (!how) {
            throw new Error('Data How tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya.');
        }

        // Cek jumlah relasi Do dan Date
        const doCount = await DoModel.countDocuments({ nama_program: id });
        const dateCount = await DateModel.countDocuments({ nama_program: id });

        let errorMessage = '';

        if (doCount > 0) {
            errorMessage += `Terdapat ${doCount} data Do yang terkait.\n`;
        }

        if (dateCount > 0) {
            errorMessage += `Terdapat ${dateCount} data Date yang terkait.\n`;
        }

        if (errorMessage) {
            errorMessage =
                `Data tidak bisa dihapus karena terdapat data terkait.\n` +
                `Judul program: ${how.nama_program}.\n` +
                errorMessage +
                `Silakan hapus semua data terkait terlebih dahulu.`;
            throw new Error(errorMessage);
        }

        return this.repo.delete(id, userId);
    }

    async searchHow(query: string, userId: string, page: number, limit: number) {
        return this.repo.search(query, userId, page, limit);
    }

    async getProgramSummary() {
        const data = await this.repo.getProgramSummary();

        return data.map(item => ({
            email: item.email,
            belum_mulai: item.belum_mulai,
            progress: item.progress,
            selesai: item.selesai
        }));
    }

    async getSummaryByUser(userId: string) {
        const result = await this.repo.getSummaryByUser(userId);
        return result[0] || {
            belum_mulai: 0,
            progress: 0,
            selesai: 0,
            total: 0,
            persentase: {
                belum_mulai: 0,
                progress: 0,
                selesai: 0
            }
        };
    }

    async getProgramProgressSummaryByUser(userId: string, page: number, limit: number) {
        return this.repo.getProgramProgressSummaryByUser(userId, page, limit);
    }
}