import { PerencanaanRepository } from '../repositories/PerencanaanRepository';
import { IndikatorModel } from '../models/IndikatorModel';

export class MonitoringService {
    private perencanaanRepo = new PerencanaanRepository();

    // Monitoring satu perencanaan
    async getMonitoringByPerencanaanId(id: string) {
        const perencanaan = await this.perencanaanRepo.findById(id);
        if (!perencanaan) throw new Error('Perencanaan tidak ditemukan');
        return this.formatMonitoring(perencanaan);
    }

    // Monitoring semua perencanaan
    async getAllMonitoring() {
        const all = await this.perencanaanRepo.findAll();
        return all.map(p => this.formatMonitoring(p));
    }

    // Format helper
    private formatMonitoring(perencanaan: any) {
        const indikator = perencanaan.id_indikator;
        const selesai = indikator.filter((i: any) => i.sudah_selesai).length;
        const total = indikator.length;
        const persenSelesai = total > 0 ? Math.round((selesai / total) * 100) : 0;

        let waktuPenyelesaian = "Belum selesai";
        let waktuPenyelesaianHari = null;

        if (perencanaan.end_date) {
            const durasiHari = Math.ceil(
                (new Date(perencanaan.end_date).getTime() - new Date(perencanaan.tgl_mulai).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            waktuPenyelesaian = `${durasiHari} hari`;
            waktuPenyelesaianHari = durasiHari;
        }

        return {
            id_perencanaan: perencanaan._id,
            nama_program: perencanaan.nama_program,
            opd: perencanaan.opd_pelaksana,
            persen_selesai: persenSelesai,
            waktu_penyelesaian: waktuPenyelesaian,
            waktu_penyelesaian_hari: waktuPenyelesaianHari, // untuk kebutuhan grafik mentah
            total_indikator: total,
            indikator_selesai: selesai,
            indikator_belum: total - selesai
        };
    }

    async getGlobalIndikatorSummary() {
        const all = await this.perencanaanRepo.findAll(); // sudah populate id_indikator
        let total = 0;
        let selesai = 0;

        for (const p of all) {
            const indikator = p.id_indikator;
            total += indikator.length;
            selesai += indikator.filter((i: any) => i.sudah_selesai).length;
        }

        const persenSelesai = total > 0 ? Math.round((selesai / total) * 100) : 0;

        return {
            total_indikator: total,
            indikator_selesai: selesai,
            indikator_belum: total - selesai,
            persen_selesai: persenSelesai
        };
    }

    async getDailyPerformance() {
        // Ambil semua indikator + perencanaan untuk akses end_date
        const allIndikator = await IndikatorModel.find()
            .select('sudah_selesai createdAt updatedAt id_perencanaan')
            .populate('id_perencanaan', 'end_date');

        const dailyData: Record<string, { completed: number, inProgress: number, behind: number }> = {};

        for (const indikator of allIndikator) {
            const updatedDate = new Date(indikator.updatedAt);
            const dateKey = updatedDate.toISOString().split('T')[0];

            if (!dailyData[dateKey]) {
                dailyData[dateKey] = { completed: 0, inProgress: 0, behind: 0 };
            }

            // Hitung completed & in-progress
            if (indikator.sudah_selesai) {
                dailyData[dateKey].completed += 1;
            } else {
                dailyData[dateKey].inProgress += 1;
            }

            // Hitung behind jika belum selesai dan sudah melewati end_date
            const perencanaan: any = indikator.id_perencanaan as any;
            const endDate = perencanaan?.end_date;
            if (!indikator.sudah_selesai && endDate && updatedDate > new Date(endDate)) {
                dailyData[dateKey].behind += 1;
            }
        }

        // Format ke array untuk grafik
        const formatted = Object.entries(dailyData).map(([date, stats]) => ({
            date,
            ...stats
        }));

        return formatted;
    }

}