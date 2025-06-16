import { HowRepository } from '../repositories/HowRepository';

export class HowService {
    private repo = new HowRepository();

    async getAllHowByUser(userId: string) {
        return this.repo.findAllByUser(userId);
    }

    async getAllHowWithPopulateByUser(userId: string) {
        return this.repo.findAllWithPopulateByUser(userId);
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

    async searchHow(query: string, userId: string) {
        return this.repo.search(query, userId);
    }
}