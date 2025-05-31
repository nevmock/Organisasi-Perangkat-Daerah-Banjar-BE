import { sign } from 'jsonwebtoken';
import { AuthModel } from '../models/AuthModel';

export class AuthService {
    private users: AuthModel[] = [];

    public register(email: string, password: string, unit: string, role: string): AuthModel {
        const newUser = new AuthModel(email, password, unit, role);
        this.users.push(newUser);
        return newUser;
    }

    public login(email: string, password: string): string | null {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (user) {
            return this.generateToken(user);
        }
        return null;
    }

    private generateToken(user: AuthModel): string {
        const payload = { email: user.email, role: user.role };
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const token = sign(payload, secret, { expiresIn: '1h' });
        return token;
    }
}