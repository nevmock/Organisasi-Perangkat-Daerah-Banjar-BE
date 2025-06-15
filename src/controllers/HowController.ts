import { Request, Response } from 'express';
import { HowService } from '../services/HowService';

export class HowController {
    private service = new HowService();

    getAll = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAllHow();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch hows' });
        }
    };

    getAllByAmplifikasi = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAllHowWithPopulate();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch hows' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getHow(req.params.id);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch how' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const data = await this.service.createHowWithIndikators(req.body);
            res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create how populated' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const data = await this.service.updateHow(req.params.id, req.body);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to update how' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            await this.service.deleteHow(req.params.id);
            res.json({ message: 'Deleted' });
        } catch {
            res.status(500).json({ error: 'Failed to delete how' });
        }
    };

    search = async (req: Request, res: Response) => {
        try {
            const q = (req.query.q as string) || '';
            const data = await this.service.searchHow(q);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to search how' });
        }
    };
}
