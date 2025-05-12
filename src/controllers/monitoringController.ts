import { Request, Response } from 'express';
import { MonitoringService } from '../services/monitoringService';

export class MonitoringController {
    private service = new MonitoringService();

    getMonitoring = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.service.getMonitoringByPerencanaanId(id);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    getAllMonitoring = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getAllMonitoring();
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    getIndikatorSummary = async (req: Request, res: Response) => {
        try {
            const result = await this.service.getGlobalIndikatorSummary();
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    
}
