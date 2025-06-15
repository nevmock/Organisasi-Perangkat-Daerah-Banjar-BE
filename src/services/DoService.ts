import { DoRepository } from '../repositories/DoRepository';

export class DoService {
    private repo = new DoRepository();

    async getAllDo() {
        return this.repo.findAll();
    }

    async getAllDoWithPopulate() {
        return this.repo.findAllWithPopulate();
    }

    async getDo(id: string) {
        return this.repo.findById(id); // populated
    }

    async createDoWithIndikators(data: any) {
        return this.repo.create(data);
    }

    async updateDo(id: string, data: any) {
        return this.repo.update(id, data);
    }   

    async deleteDo(id: string) {
        return this.repo.delete(id);
    }

    async searchDo(query: string) {
        return this.repo.search(query);
    }
}