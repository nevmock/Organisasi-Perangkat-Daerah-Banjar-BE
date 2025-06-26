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