import { Request, Response } from 'express';
import { AmplifikasiService } from '../services/AmplifikasiService';
import { buildEvidenceUrls } from '../utils/buildEvidenceUrl';

export class AmplifikasiController {
    private service = new AmplifikasiService();

    getAll = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAllAmplifikasis();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch Amplifikasi' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getAmplifikasi(req.params.id);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch Amplifikasi' });
        }
    };

    getByPerencanaan = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getByPerencanaan(req.params.perencanaanId);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch Amplifikasi by perencanaan' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const data = await this.service.createAmplifikasi(req.body);
            res.status(201).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create Amplifikasi' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const data = await this.service.updateAmplifikasi(req.params.id, req.body);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to update Amplifikasi' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            await this.service.deleteAmplifikasi(req.params.id);
            res.json({ message: 'Deleted' });
        } catch {
            res.status(500).json({ error: 'Failed to delete Amplifikasi' });
        }
    };

    uploadEvidence = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                res.status(400).json({ error: 'File evidence wajib diisi' });
                return;
            }

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const urls = buildEvidenceUrls(files, baseUrl);

            const updated = await this.service.addEvidence(id, urls);
            res.json(updated);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to upload evidence' });
        }
    };

    removeEvidence = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { url } = req.body;

            if (!url) return res.status(400).json({ error: 'Evidence URL harus disediakan' });

            const result = await this.service.removeEvidence(id, url);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: 'Gagal menghapus evidence' });
        }
    };

}
