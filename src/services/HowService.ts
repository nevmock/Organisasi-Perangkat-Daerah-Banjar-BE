import { HowRepository } from '../repositories/HowRepository';

export class HowService {
    private repo = new HowRepository();

    async getAllHow() {
        return this.repo.findAll();
    }

    async getAllHowWithPopulate() {
        return this.repo.findAllWithPopulate();
    }

    async getHow(id: string) {
        return this.repo.findById(id); // populated
    }

    async createHowWithIndikators(data: any) {
        return this.repo.create(data);
    }

    async updateHow(id: string, data: any) {
        return this.repo.update(id, data);
    }   

    async deleteHow(id: string) {
        return this.repo.delete(id);
    }

    async searchHow(query: string) {
        return this.repo.search(query);
    }
}