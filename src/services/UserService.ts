import mongoose from 'mongoose';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
    private userRepository = new UserRepository();

    async getAllUsersWithCounts(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const users = await this.userRepository.getAllNonSuperAdminUsers(skip, limit);

        const totalUsers = await this.userRepository.countNonSuperAdminUsers();

        const results = await Promise.all(
            users.map(async (user) => {
                const counts = await this.userRepository.countHowDoDateByUser(user._id);
                const { password, ...userWithoutPassword } = user.toObject();

                return {
                    ...userWithoutPassword,
                    ...counts,
                };
            })
        );

        return {
            data: results,
            pagination: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit),
            },
        };
    }
}
