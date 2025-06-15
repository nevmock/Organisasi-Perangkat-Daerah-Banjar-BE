import { Request, Response } from 'express';
import { DateService } from '../services/DateService';

export class DateController {
    private service = new DateService();

    getAll = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAllDate();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch dos' });
        }
    };

    getAllByAmplifikasi = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAllDateWithPopulate();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch dos' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getDate(req.params.id);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch do' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const data = await this.service.createDateWithIndikators(req.body);
            res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create do populated' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const data = await this.service.updateDate(req.params.id, req.body);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to update do' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            await this.service.deleteDate(req.params.id);
            res.json({ message: 'Deleted' });
        } catch {
            res.status(500).json({ error: 'Failed to delete do' });
        }
    };

    search = async (req: Request, res: Response) => {
        try {
            const q = (req.query.q as string) || '';
            const data = await this.service.searchDate(q);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to search do' });
        }
    };
}
