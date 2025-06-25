import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    private userService = new UserService();

    public getUsersWithCounts = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.max(1, parseInt(req.query.limit as string) || 10);

            const { data, pagination } = await this.userService.getAllUsersWithCounts(page, limit);

            res.json({
                success: true,
                data: data,
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages,
            });
        } catch (error) {
            console.error('Error in getUsersWithCounts:', error);

            res.status(500).json({
                success: false,
                message: 'Failed to fetch users and counts',
                error: (error as Error).message || error,
            });
        }
    };
}