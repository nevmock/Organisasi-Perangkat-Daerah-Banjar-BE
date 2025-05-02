import { Request, Response } from 'express';
import { IndikatorService } from '../services/IndikatorService';

export class IndikatorController {
    private service = new IndikatorService();

    getAll = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getAllIndikators();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch indikator' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getIndikator(req.params.id);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch indikator' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const data = await this.service.createIndikator(req.body);
            res.status(201).json(data);
        } catch {
            res.status(500).json({ error: 'Failed to create indikator' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const data = await this.service.updateIndikator(req.params.id, req.body);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to update indikator' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            await this.service.deleteIndikator(req.params.id);
            res.json({ message: 'Deleted' });
        } catch {
            res.status(500).json({ error: 'Failed to delete indikator' });
        }
    };

    uploadEvidence = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const files = req.files as Express.Multer.File[];
            const { id_perencanaan } = req.body;

            if (!id_perencanaan || !files || files.length === 0) {
                res.status(400).json({ error: 'id_perencanaan dan files wajib diisi' });
                return; // <-- stop eksekusi
            }

            const filePaths = files.map(file => file.path);

            const updated = await this.service.addEvidence(id, filePaths);

            res.json(updated);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to upload evidence' });
        }
    };

}
