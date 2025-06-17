import { HowModel } from '../models/HowModel';

export class HowDashboardService {
    static async getSummary(userId: string, startDate: Date, endDate: Date) {
        const matchStage = {
            createdBy: userId,
            createdAt: { $gte: startDate, $lte: endDate }
        };

        const programs = await HowModel.find(matchStage);

        const total_program = programs.length;
        const total_anggaran = programs.reduce((sum, p) => sum + (p.rencana_anggaran?.jumlah || 0), 0);
        const anggarans = programs.map(p => p.rencana_anggaran?.jumlah || 0);
        const rata_rata_anggaran = anggarans.length ? total_anggaran / anggarans.length : 0;
        const max_anggaran = Math.max(...anggarans, 0);
        const min_anggaran = Math.min(...anggarans, 0);

        const peserta = programs.map(p => p.target_indikator_kinerja?.jumlah_peserta || 0);
        const pelatihan = programs.map(p => p.target_indikator_kinerja?.jumlah_pelatihan || 0);
        const kepuasan = programs.map(p => p.target_indikator_kinerja?.tingkat_kepuasan || 0);

        const rata_rata_indikator = {
            peserta: peserta.reduce((a, b) => a + b, 0) / peserta.length || 0,
            pelatihan: pelatihan.reduce((a, b) => a + b, 0) / pelatihan.length || 0,
            kepuasan: kepuasan.reduce((a, b) => a + b, 0) / kepuasan.length || 0
        };

        const max_indikator = {
            peserta: Math.max(...peserta, 0),
            pelatihan: Math.max(...pelatihan, 0),
            kepuasan: Math.max(...kepuasan, 0)
        };

        const min_indikator = {
            peserta: Math.min(...peserta, 0),
            pelatihan: Math.min(...pelatihan, 0),
            kepuasan: Math.min(...kepuasan, 0)
        };

        const kecamatanCounts: Record<string, number> = {};
        programs.forEach(p => {
            const k = p.rencana_lokasi?.kecamatan;
            if (k) {
                kecamatanCounts[k] = (kecamatanCounts[k] || 0) + 1;
            }
        });

        const sumberDanaAggregate: Record<string, number> = {};
        programs.forEach(p => {
            (p.rencana_anggaran?.sumber_dana || []).forEach(sd => {
                if (sd.jenis !== null && sd.jenis !== undefined) {
                    sumberDanaAggregate[sd.jenis] = (sumberDanaAggregate[sd.jenis] || 0) + (sd.persentase ?? 0);
                }
            });
        });

        const totalPersen = Object.values(sumberDanaAggregate).reduce((a, b) => a + b, 0);
        const sumber_dana = Object.fromEntries(
            Object.entries(sumberDanaAggregate).map(([k, v]) => [k, Math.round((v / totalPersen) * 100)])
        );

        const terbaru = programs
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5)
            .map(p => ({
                nama_program: p.nama_program,
                createdAt: p.createdAt
            }));

        return {
            summary: {
                total_program,
                total_anggaran,
                rata_rata_anggaran,
                max_anggaran,
                min_anggaran,
                rata_rata_indikator,
                max_indikator,
                min_indikator
            },
            distribusi: {
                kecamatan: kecamatanCounts,
                sumber_dana
            },
            terbaru
        };
    }
}
