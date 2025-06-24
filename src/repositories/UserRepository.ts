import mongoose from 'mongoose';
import { AuthModel } from '../models/AuthModel';
import { HowModel } from '../models/HowModel';
import { DoModel } from '../models/DoModel';
import { DateModel } from '../models/DateModel';

export class UserRepository {
    async getAllNonSuperAdminUsers(skip: number, limit: number) {
        return AuthModel.find({ role: { $ne: 'superadmin' } })
        .skip(skip)
        .limit(limit)
        .exec();
    }

    async countNonSuperAdminUsers() {
        return AuthModel.countDocuments({ role: { $ne: 'superadmin' } }).exec();
    }

    async countHowDoDateByUser(userId: mongoose.Types.ObjectId) {
        const howCount = await HowModel.countDocuments({ createdBy: userId }).exec();
        const doCount = await DoModel.countDocuments({ createdBy: userId }).exec();
        const dateCount = await DateModel.countDocuments({ createdBy: userId }).exec();

        return {
        howCount,
        doCount,
        dateCount,
        };
    }
}
