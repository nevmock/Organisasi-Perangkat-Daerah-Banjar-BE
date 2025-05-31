import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async registerUser(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password, unit, role } = req.body;
            const user = this.authService.register(email, password, unit, role);
            return res.status(201).json(user);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            return res.status(400).json({ message });
        }
    }

    public async loginUser(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const token = this.authService.login(email, password);
            return res.status(200).json({ token });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            return res.status(401).json({ message });
        }
    }
}

export default AuthController;