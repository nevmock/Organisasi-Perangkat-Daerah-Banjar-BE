import { DateRepository } from '../repositories/DateRepository';

export class DateService {
    private repo = new DateRepository();

    async getAllDate() {
        return this.repo.findAll();
    }

    async getAllDateWithPopulate() {
        return this.repo.findAllWithPopulate();
    }

    async getDate(id: string) {
        return this.repo.findById(id); // populated
    }

    async createDateWithIndikators(data: any) {
        return this.repo.create(data);
    }

    async updateDate(id: string, data: any) {
        return this.repo.update(id, data);
    }   

    async deleteDate(id: string) {
        return this.repo.delete(id);
    }

    async searchDate(query: string) {
        return this.repo.search(query);
    }
}