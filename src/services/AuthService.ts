import { sign } from 'jsonwebtoken';
import { AuthModel } from '../models/AuthModel';
import bcrypt from 'bcrypt';

export class AuthService {
    public async register(email: string, password: string, unit: string, role: string) {
        const existing = await AuthModel.findOne({ email });
        if (existing) throw new Error('Email sudah terdaftar');

        // Hash password sebelum simpan
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await AuthModel.create({ email, password: hashedPassword, unit, role });
        return { email: user.email, unit: user.unit, role: user.role, id: user._id };
    }

    public async login(email: string, password: string): Promise<string> {
        const user = await AuthModel.findOne({ email });
        if (!user) throw new Error('Email atau password salah');

        // Bandingkan password dengan hash
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Email atau password salah');

        return this.generateToken(user);
    }

    private generateToken(user: any): string {
        const payload = { email: user.email, role: user.role, id: user._id };
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        return sign(payload, secret, { expiresIn: '1h' });
    }
}