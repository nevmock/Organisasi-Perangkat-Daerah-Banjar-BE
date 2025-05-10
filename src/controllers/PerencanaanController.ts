import { Request, Response } from 'express';
import { PerencanaanService } from '../services/PerencanaanService';

export class PerencanaanController {
    private service = new PerencanaanService();

    getAll = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAllPerencanaans();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch perencanaans' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getPerencanaan(req.params.id);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch perencanaan' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const data = await this.service.createPerencanaanWithIndikators(req.body);
            res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create perencanaan with indicators' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const data = await this.service.updatePerencanaan(req.params.id, req.body);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to update perencanaan' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            await this.service.deletePerencanaan(req.params.id);
            res.json({ message: 'Deleted' });
        } catch {
            res.status(500).json({ error: 'Failed to delete perencanaan' });
        }
    };
}
