// types/express/index.d.ts
import { UserPayload } from '../../interfaces/UserPayload';

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
