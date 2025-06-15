import { Request, Response } from 'express';
import { DoService } from '../services/DoService';

export class DoController {
    private service = new DoService();

    getAll = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAllDo();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch dos' });
        }
    };

    getAllByAmplifikasi = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAllDoWithPopulate();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch dos' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getDo(req.params.id);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch do' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const data = await this.service.createDoWithIndikators(req.body);
            res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create do populated' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const data = await this.service.updateDo(req.params.id, req.body);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to update do' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            await this.service.deleteDo(req.params.id);
            res.json({ message: 'Deleted' });
        } catch {
            res.status(500).json({ error: 'Failed to delete do' });
        }
    };

    search = async (req: Request, res: Response) => {
        try {
            const q = (req.query.q as string) || '';
            const data = await this.service.searchDo(q);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to search do' });
        }
    };
}
