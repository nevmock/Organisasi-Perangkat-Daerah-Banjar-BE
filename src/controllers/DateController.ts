import { Request, Response } from 'express';
import { DateService } from '../services/DateService';
import path from 'path';
import fs from 'fs';

export class DateController {
    private service = new DateService();

    getAll = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const data = await this.service.getAllDate(userId, page, limit);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch dates' });
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
            const data = await this.service.getAllDateWithPopulate(userId, page, limit);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch dates with populate' });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            const data = await this.service.getDate(req.params.id, userId);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch date' });
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            const data = await this.service.createDate(req.body, userId);
            res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create date' });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            const data = await this.service.updateDate(req.params.id, req.body, userId);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update date' });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        try {
            await this.service.deleteDate(req.params.id, userId);
            res.json({ message: 'Deleted' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete date' });
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
            const data = await this.service.searchDate(q, userId, page, limit);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to search dates' });
        }
    };

    addDokumentasi = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: user ID not found' });
            return;
        }

        const { id } = req.params;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No files uploaded' });
            return;
        }

        // Prepare file paths to delete if needed
        const filePaths = files.map((file) =>
            path.join('public/uploads/dokumentasi/', file.filename)
        );

        try {
            const data = await this.service.addDokumentasi(id, userId, files);

            if (!data) {
                // Clean up uploaded files if operation fails (e.g. not found / unauthorized)
                filePaths.forEach((filePath) => {
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('Error deleting file:', filePath, err);
                    });
                });

                res.status(404).json({ error: 'Do not found or unauthorized' });
                return;
            }

            res.json(data);
        } catch (err) {
            // Clean up files on any error
            filePaths.forEach((filePath) => {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', filePath, err);
                });
            });

            console.error(err);
            res.status(500).json({ error: 'Failed to upload laporan files' });
        }
    };

    deleteDokumentasi = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { id } = req.params;
        const filename = req.query.filename as string;

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
    }
}