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
}