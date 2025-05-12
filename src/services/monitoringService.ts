import { PerencanaanRepository } from '../repositories/PerencanaanRepository';

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
    
}