import { Request, Response } from 'express';
import { HowService } from '../services/HowService';
import { HowDashboardService } from '../services/HowDashboardService';

export class HowController {
    private service = new HowService();

    getAll = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali: user ID not found' });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const withPagination = req.query.all !== 'true'; // kalau ?all=true maka pagination dimatikan

        try {
            const data = await this.service.getAllHowByUser(userId, page, limit, withPagination);
            res.json(data);
        } catch {
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data How' });
        }
    };

    getAllByAmplifikasi = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const data = await this.service.getAllHowWithPopulateByUser(userId, page, limit);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data How' });
        }
    };

    getAllByUserforSuperAdmin = async (req: Request, res: Response): Promise<void> => {
        const userRole = req.user?.role;
        if (userRole !== "superadmin") {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        const userId = req.params.userId

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const data = await this.service.getAllHowWithPopulateByUser(userId, page, limit);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data How' });
        }
    };

    getDoDateDetailsByHowIdAdmin = async (req: Request, res: Response): Promise<void> => {
        try {
            const userRole = req.user?.role;
            if (userRole !== "superadmin") {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
            
            const howId = req.params.howId;
            const detail = await this.service.getDoDateDetailsByHowIdAdmin(howId);
            if (!detail) {
                res.status(404).json({ message: 'Data not found' });
                return;
            }
            res.json(detail);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching detail', error });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
            return;
        }

        try {
            const data = await this.service.getHow(req.params.id, userId);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data How' });
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
            return;
        }

        try {
            const data = await this.service.createHowWithIndikators(req.body, userId);
            res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data How' });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
            return;
        }

        try {
            const data = await this.service.updateHow(req.params.id, req.body, userId);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengubah data How' });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
            return;
        }

        try {
            await this.service.deleteHow(req.params.id, userId);
            res.json({ message: 'Data Berhasil dihapus' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data How' });
        }
    };

    search = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
            return;
        }

        const q = (req.query.q as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const data = await this.service.searchHow(q, userId, page, limit);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan saat mencari data How' });
        }
    };

    dashboardSummary = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
            return;
        }

        try {
            const { start, end } = req.query;

            const startDate = start ? new Date(start as string) : new Date('2000-01-01');
            const endDate = end ? new Date(end as string) : new Date();

            const data = await HowDashboardService.getSummary(userId, startDate, endDate);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil ringkasan' });
        }
    };

    getProgramSummary = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user;

            if (!user?.id) {
            res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
            return;
            }

            if (user.role !== 'superadmin') {
            res.status(403).json({ message: 'Anda tidak memiliki izin untuk mengakses resource ini' });
            return;
            }

            const result = await this.service.getProgramSummary();
            res.json({ data: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil ringkasan' });
        }
    }

    getUserSummary = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user;
            if (!user?.id || !user?.email) {
                res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
                return;
            }

            const summary = await this.service.getSummaryByUser(user.id);
            res.json({
                email: user.email,
                ...summary
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil ringkasan program' });
        }
    }

    getProgramProgressSummaryByUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Sesi Anda tidak valid atau telah berakhir. Silakan login kembali' });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.service.getProgramProgressSummaryByUser(userId, page, limit);

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil ringkasan progres.' });
        }
    };
}