import { Request, Response } from 'express';
import { IndikatorService } from '../services/IndikatorService';
import { buildEvidenceUrls } from '../utils/buildEvidenceUrl';

export class IndikatorController {
    private service = new IndikatorService();

    getAll = async (_req: Request, res: Response) => {
        try {
            const data = await this.service.getAllIndikators();
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data indikator' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getIndikator(req.params.id);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data indikator' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const data = await this.service.createIndikator(req.body);
            res.status(201).json(data);
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat menyimpan data indikator' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const data = await this.service.updateIndikator(req.params.id, req.body);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui data indikator' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            await this.service.deleteIndikator(req.params.id);
            res.json({ message: 'Deleted' });
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data indikator' });
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
            res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah evidence' });
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
            res.status(500).json({ error: 'Terjadi kesalahan saat menghapus evidence' });
        }
    };

    search = async (req: Request, res: Response) => {
        try {
            const q = (req.query.q as string) || '';
            const data = await this.service.searchIndikator(q);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat mencari data indikator' });
        }
    };
}
