import { Request, Response } from 'express';
import { PerencanaanService } from '../services/PerencanaanService';

export class PerencanaanController {
    private service = new PerencanaanService();

    getAll = async (req: Request, res: Response) => {
        const data = await this.service.getAllPerencanaans();
        res.json(data);
    };

    getById = async (req: Request, res: Response) => {
        const data = await this.service.getPerencanaan(req.params.id);
        res.json(data);
    };

    create = async (req: Request, res: Response) => {
        const data = await this.service.createPerencanaan(req.body);
        res.status(201).json(data);
    };

    update = async (req: Request, res: Response) => {
        const data = await this.service.updatePerencanaan(req.params.id, req.body);
        res.json(data);
    };

    delete = async (req: Request, res: Response) => {
        await this.service.deletePerencanaan(req.params.id);
        res.json({ message: 'Deleted' });
    };
}
