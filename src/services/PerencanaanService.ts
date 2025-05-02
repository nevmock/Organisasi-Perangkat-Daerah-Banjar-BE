import { PerencanaanRepository } from '../repositories/PerencanaanRepository';

export class PerencanaanService {
    private repo = new PerencanaanRepository();

    getAllPerencanaans() {
        return this.repo.findAll();
    }

    getPerencanaan(id: string) {
        return this.repo.findById(id);
    }

    createPerencanaan(data: any) {
        return this.repo.create(data);
    }

    updatePerencanaan(id: string, data: any) {
        return this.repo.update(id, data);
    }

    deletePerencanaan(id: string) {
        return this.repo.delete(id);
    }
}
