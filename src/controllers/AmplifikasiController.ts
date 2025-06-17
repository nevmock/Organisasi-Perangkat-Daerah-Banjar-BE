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
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data Amplifikasi' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const data = await this.service.getAmplifikasi(req.params.id);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data Amplifikasi' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const data = await this.service.updateAmplifikasi(req.params.id, req.body);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui data Amplifikasi' });
        }
    };    

    delete = async (req: Request, res: Response) => {
        try {
            await this.service.deleteAmplifikasi(req.params.id);
            res.json({ message: 'Data berhasil dihapus' });
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data Amplifikasi' });
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
            res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah bukti' });
        }
    };

    uploadThumbnail = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const files = req.files as Express.Multer.File[];
    
            if (!files || files.length === 0) {
                res.status(400).json({ error: 'File thumbnail wajib diisi' });
                return;
            }
    
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const urls = buildEvidenceUrls(files, baseUrl);
    
            const updated = await this.service.addThumbnail(id, urls);
            res.json(updated);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah thumbnail' });
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
            const data = await this.service.searchAmplifikasi(q);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Terjadi kesalahan saat mencari data Amplifikasi' });
        }
    };
}
