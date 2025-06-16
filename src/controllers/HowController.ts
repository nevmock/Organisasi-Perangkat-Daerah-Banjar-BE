import { Request, Response } from 'express';
import { HowService } from '../services/HowService';

export class HowController {
    private service = new HowService();

    getAll = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const data = await this.service.getAllHowByUser(userId, page, limit);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch hows' });
        }
    };

    getAllByAmplifikasi = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const data = await this.service.getAllHowWithPopulateByUser(userId, page, limit);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch hows' });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            const data = await this.service.getHow(req.params.id, userId);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch how' });
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            const data = await this.service.createHowWithIndikators(req.body, userId);
            res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create how populated' });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            const data = await this.service.updateHow(req.params.id, req.body, userId);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to update how' });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            await this.service.deleteHow(req.params.id, userId);
            res.json({ message: 'Deleted' });
        } catch {
            res.status(500).json({ error: 'Failed to delete how' });
        }
    };

    search = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        const q = (req.query.q as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const data = await this.service.searchHow(q, userId, page, limit);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to search how' });
        }
    };
}