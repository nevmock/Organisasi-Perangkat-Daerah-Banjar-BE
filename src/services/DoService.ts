import { DoRepository } from '../repositories/DoRepository';

export class DoService {
    private repo = new DoRepository();

    async getAllDo(userId: string) {
        return this.repo.findAllByUser(userId);
    }

    async getAllDoWithPopulate(userId: string) {
        return this.repo.findAllWithPopulateByUser(userId);
    }

    async getDo(id: string, userId: string) {
        return this.repo.findById(id, userId); // include createdBy check
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

    async searchDo(query: string, userId: string) {
        return this.repo.search(query, userId);
    }
}
