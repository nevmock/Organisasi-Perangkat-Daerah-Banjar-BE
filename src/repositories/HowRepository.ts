import mongoose, { Types } from 'mongoose';
import { DateModel } from '../models/DateModel';
import { DoModel } from '../models/DoModel';
import { HowModel } from '../models/HowModel';

export class HowRepository {

    async findAllByUser(userId: string, page = 1, limit = 10, withPagination = true) {
        if (!withPagination) {
            const data = await HowModel.find({ createdBy: userId }).sort({ createdAt: -1 });
            return {
                data,
                total: data.length,
            };
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            HowModel.find({ createdBy: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            HowModel.countDocuments({ createdBy: userId }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findAllWithPopulateByUser(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            HowModel.find({ createdBy: userId })
                .populate('createdBy', 'email unit')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            HowModel.countDocuments({ createdBy: userId }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getDoDateDetailsByHowIdAdmin(howId: string) {
        const howObjectId = new mongoose.Types.ObjectId(howId);

        const how = await HowModel.findOne({ _id: howObjectId }).exec();
        if (!how) return null;

        const doDetails = await DoModel.find({ nama_program: howObjectId })
            .populate({ path: 'nama_program', select: 'nama_program' })
            .exec();
        const dateDetails = await DateModel.find({ nama_program: howObjectId })
            .populate({ path: 'nama_program', select: 'nama_program' })
            .exec();

        return {
            how,
            doDetails,
            dateDetails
        };
    }

    async findById(id: string, userId: string) {
        return HowModel.findOne({ _id: id, createdBy: userId });
    }

    async create(data: any, userId: string) {
        return HowModel.create({ ...data, createdBy: userId });
    }

    async update(id: string, data: any, userId: string) {
        return HowModel.findOneAndUpdate(
            { _id: id, createdBy: userId },
            data,
            { new: true }
        );
    }

    async delete(id: string, userId: string) {
        return HowModel.findOneAndDelete({ _id: id, createdBy: userId });
    }

    async search(query: string, userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const filter = {
            createdBy: userId,
            $or: [
                { nama_program: { $regex: query, $options: 'i' } },
                { tujuan_program: { $regex: query, $options: 'i' } },
                { sasaran_program: { $regex: query, $options: 'i' } },
                { 'rencana_lokasi.kelurahan': { $regex: query, $options: 'i' } },
                { 'rencana_lokasi.kecamatan': { $regex: query, $options: 'i' } },
                { 'rencana_lokasi.kota': { $regex: query, $options: 'i' } },
                { opd_pengusul_utama: { $regex: query, $options: 'i' } },
                { opd_kolaborator: { $elemMatch: { $regex: query, $options: 'i' } } },
            ],
        };

        const [data, total] = await Promise.all([
            HowModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            HowModel.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getProgramSummary() {
        return HowModel.aggregate([
            {
                $lookup: {
                    from: 'dos',
                    localField: '_id',
                    foreignField: 'nama_program',
                    as: 'do_list'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    total_do: { $size: '$do_list' },
                    selesai_do: {
                    $size: {
                        $filter: {
                        input: '$do_list',
                        as: 'doItem',
                        cond: { $eq: [ { $ifNull: ['$$doItem.status', false] }, true ] }
                        }
                    }
                    }
                }
            },
            {
                $project: {
                    email: '$user.email',
                    belum_mulai: {
                    $cond: [
                        { $eq: ['$total_do', 0] },
                        1,
                        { $cond: [{ $eq: ['$selesai_do', 0] }, 1, 0] }
                    ]
                    },
                    progress: {
                    $cond: [
                        {
                        $and: [
                            { $gt: ['$selesai_do', 0] },
                            { $lt: ['$selesai_do', '$total_do'] }
                        ]
                        },
                        1,
                        0
                    ]
                    },
                    selesai: {
                    $cond: [
                        {
                        $and: [
                            { $gt: ['$total_do', 0] },
                            { $eq: ['$selesai_do', '$total_do'] }
                        ]
                        },
                        1,
                        0
                    ]
                    }
                }
            },
            {
                $match: {
                    email: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$email',
                    belum_mulai: { $sum: '$belum_mulai' },
                    progress: { $sum: '$progress' },
                    selesai: { $sum: '$selesai' }
                }
            },
            {
                $project: {
                    _id: 0,
                    email: '$_id',
                    belum_mulai: 1,
                    progress: 1,
                    selesai: 1
                }
            },
            {
                $sort: {
                    selesai: -1,
                    progress: -1,
                    belum_mulai: -1,
                    email: 1
                }
            }
        ]);
    }

    async getSummaryByUser(userId: string) {
        return HowModel.aggregate([
            {
                $match: { createdBy: new Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'dos',
                    localField: '_id',
                    foreignField: 'nama_program',
                    as: 'do_list'
                }
            },
            {
                $addFields: {
                    total_do: { $size: '$do_list' },
                    selesai_do: {
                    $size: {
                                $filter: {
                                input: '$do_list',
                                as: 'd',
                                cond: { $eq: ['$$d.status', true] }
                            }
                        }
                    }
                }
            },
            {
            $addFields: {
                kategori: {
                    $switch: {
                        branches: [
                        {
                            case: { $eq: ['$total_do', 0] },
                            then: 'belum_mulai'
                        },
                        {
                            case: {
                                $and: [
                                    { $gt: ['$selesai_do', 0] },
                                    { $lt: ['$selesai_do', '$total_do'] }
                                ]
                            },
                            then: 'progress'
                        },
                        {
                            case: {
                                $and: [
                                    { $gt: ['$total_do', 0] },
                                    { $eq: ['$selesai_do', '$total_do'] }
                                ]
                            },
                            then: 'selesai'
                        }
                        ],
                        default: 'belum_mulai'
                    }
                }
            }
            },
            {
                $group: {
                    _id: '$kategori',
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    counts: {
                       $push: { k: '$_id', v: '$count' }
                    },
                    total: { $sum: '$count' }
                }
            },
            {
                $addFields: {
                    data: { $arrayToObject: '$counts' }
                }
            },
            {
                $project: {
                    _id: 0,
                    belum_mulai: { $ifNull: ['$data.belum_mulai', 0] },
                    progress: { $ifNull: ['$data.progress', 0] },
                    selesai: { $ifNull: ['$data.selesai', 0] },
                    persentase: {
                        belum_mulai: {
                            $cond: [
                            { $gt: ['$total', 0] },
                            { 
                                $round: [
                                { 
                                    $multiply: [
                                    { 
                                        $divide: [
                                        { $ifNull: ['$data.belum_mulai', 0] }, 
                                        '$total' 
                                        ] 
                                    }, 
                                    100 
                                    ] 
                                }, 
                                2
                                ] 
                            },
                            0
                            ]
                        },
                        progress: {
                            $cond: [
                            { $gt: ['$total', 0] },
                            { 
                                $round: [
                                { 
                                    $multiply: [
                                    { 
                                        $divide: [
                                        { $ifNull: ['$data.progress', 0] }, 
                                        '$total' 
                                        ] 
                                    }, 
                                    100 
                                    ] 
                                }, 
                                2
                                ] 
                            },
                            0
                            ]
                        },
                        selesai: {
                            $cond: [
                            { $gt: ['$total', 0] },
                            { 
                                $round: [
                                { 
                                    $multiply: [
                                    { 
                                        $divide: [
                                        { $ifNull: ['$data.selesai', 0] }, 
                                        '$total' 
                                        ] 
                                    }, 
                                    100 
                                    ] 
                                }, 
                                2
                                ] 
                            },
                            0
                            ]
                        }
                    }
                }
            }
        ]);
    }

    async getProgramProgressSummaryByUser(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const data = await HowModel.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'dos',
                    localField: '_id',
                    foreignField: 'nama_program',
                    as: 'do_list'
                }
            },
            {
                $addFields: {
                jumlah_do: { $size: '$do_list' },
                jumlah_do_selesai: {
                    $size: {
                        $filter: {
                            input: '$do_list',
                            as: 'doItem',
                            cond: { $eq: [ { $ifNull: ['$$doItem.status', false] }, true ] }
                        }
                    }
                }
                }
            },
            {
                $project: {
                _id: 0,
                nama_program: 1,
                jumlah_do: 1,
                progress: {
                    $cond: [
                    { $eq: ['$jumlah_do', 0] },
                    0,
                    {
                        $floor: {
                            $multiply: [
                                { $divide: ['$jumlah_do_selesai', '$jumlah_do'] },
                                100
                            ]
                        }
                    }
                    ]
                }
                }
            },
            {
                $sort: {
                    progress: -1,
                    jumlah_do: -1
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);

        const total = await HowModel.countDocuments({ createdBy: new mongoose.Types.ObjectId(userId) });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
}