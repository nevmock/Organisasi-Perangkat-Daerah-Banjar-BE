import fs from 'fs';
import path from 'path';

import { NextFunction, Request, Response } from 'express';
import { DoService } from '../services/DoService';

export class DoController {
    private service = new DoService();

    getAll = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const data = await this.service.getAllDo(userId, page, limit);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch dos' });
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
            const data = await this.service.getAllDoWithPopulate(userId, page, limit);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch dos' });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            const data = await this.service.getDo(req.params.id, userId);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to fetch do' });
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            const data = await this.service.createDoWithIndikators(req.body, userId);
            res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create do populated' });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            const data = await this.service.updateDo(req.params.id, req.body, userId);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to update do' });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            await this.service.deleteDo(req.params.id, userId);
            res.json({ message: 'Deleted' });
        } catch {
            res.status(500).json({ error: 'Failed to delete do' });
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
            const data = await this.service.searchDo(q, userId, page, limit);
            res.json(data);
        } catch {
            res.status(500).json({ error: 'Failed to search do' });
        }
    };

    addDokumentasi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        const doId = req.params.id;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No files uploaded' });
            return;
        }

        const fileUrls = files.map((file) => `/uploads/dokumentasi/${file.filename}`);
        const filePaths = files.map((file) => path.join('public/uploads/dokumentasi/', file.filename));

        try {
            const updated = await this.service.addDokumentasi(doId, fileUrls, userId);
            if (!updated) {
                filePaths.forEach((filePath) => {
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('Error deleting file:', filePath, err);
                    });
                });

                res.status(404).json({ error: 'Do not found or unauthorized' });
                return;
            }

            res.status(200).json(updated);
        } catch (err) {
            filePaths.forEach((filePath) => {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', filePath, err);
                });
            });

            console.error(err);
            res.status(500).json({ error: 'Failed to add dokumentasi' });
        }
    };

    deleteDokumentasi = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { id } = req.params;
        const filename = req.query.filename as string;

        console.log(userId, filename);
        
        if (!userId || !filename) {
            res.status(400).json({ error: 'User ID or filename missing' });
            return;
        }

        try {
            const result = await this.service.deleteDokumentasi(id, userId, filename);
            if (!result) {
                res.status(404).json({ error: 'Data not found or unauthorized' });
                return;
            }

            res.json({ message: 'File deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete file' });
        }
    };

}