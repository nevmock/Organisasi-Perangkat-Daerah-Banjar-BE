import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
    nama: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    unit: { type: String, required: true },
    role: { type: String, required: true }
}, { timestamps: true });

export const AuthModel = mongoose.model('User', authSchema);