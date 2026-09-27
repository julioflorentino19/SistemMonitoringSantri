import { useState } from 'react';
import { santriData, hafalanData, kehadiranData, iuranData, getSantriName, getUsia } from '../data';

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState<'kehadiran' | 'hafalan' | 'iuran'>('kehadiran');

  // Kehadiran stats
  const uniqueDates = [...new Set(kehadiranData.map(k => k.tanggal))].sort();
  const kehadiranByDate = uniqueDates.map(date => {
    const dayData = kehadiranData.filter(k => k.tanggal === date);
    return {
      date,
      hadir: dayData.filter(k => k.status === 'hadir').length,
      izin: dayData.filter(k => k.status === 'izin').length,
      sakit: dayData.filter(k => k.status === 'sakit').length,
      alpha: dayData.filter(k => k.status === 'alpha').length,
      total: dayData.length,
    };
  });

  // Per-santri kehadiran
  const kehadiranPerSantri = santriData.map(s => {
    const records = kehadiranData.filter(k => k.santriId === s.id);
    const hadir = records.filter(k => k.status === 'hadir').length;
    return { ...s, total: records.length, hadir, persentase: records.length > 0 ? Math.round((hadir / records.length) * 100) : 0 };
  });

  // Hafalan per santri
  const hafalanPerSantri = santriData.map(s => {
    const records = hafalanData.filter(h => h.santriId === s.id);
    const lancar = records.filter(h => h.status === 'lancar').length;
    const avgNilai = records.length > 0 ? Math.round(records.reduce((sum, h) => sum + h.nilai, 0) / records.length) : 0;
    return { ...s, total: records.length, lancar, avgNilai };
  });

  // Iuran summary
  const totalTagihan = iuranData.reduce((s, i) => s + i.jumlahTagihan, 0);
  const totalBayar = iuranData.reduce((s, i) => s + i.jumlahBayar, 0);
  const totalLunas = iuranData.filter(i => i.status === 'lunas').length;
  const totalSebagian = iuranData.filter(i => i.status === 'sebagian').length;
  const totalBelum = iuranData.filter(i => i.status === 'belum_bayar').length;

  const tabs = [
    { id: 'kehadiran' as const, label: '📋 Kehadiran', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'hafalan' as const, label: '📖 Hafalan', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'iuran' as const, label: '💰 Iuran', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">📊 Laporan</h1>
          <p className="text-sm text-gray-500">Ringkasan dan analisis data santri</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Kehadiran Tab */}
      {activeTab === 'kehadiran' && (
        <div className="space-y-4">
          {/* Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Grafik Kehadiran Harian</h3>
            <div className="space-y-3">
              {kehadiranByDate.map((day, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className="text-xs text-gray-500">{day.hadir}/{day.total} hadir</span>
                  </div>
                  <div className="flex h-6 rounded-lg overflow-hidden bg-gray-100">
                    <div className="bg-emerald-500 flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${(day.hadir / day.total) * 100}%` }}>
                      {day.hadir > 0 ? day.hadir : ''}
                    </div>
                    <div className="bg-blue-400 flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${(day.izin / day.total) * 100}%` }}>
                      {day.izin > 0 ? day.izin : ''}
                    </div>
                    <div className="bg-amber-400 flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${(day.sakit / day.total) * 100}%` }}>
                      {day.sakit > 0 ? day.sakit : ''}
                    </div>
                    <div className="bg-red-400 flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${(day.alpha / day.total) * 100}%` }}>
                      {day.alpha > 0 ? day.alpha : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Hadir</span>
              <span className="text-xs flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded"></span> Izin</span>
              <span className="text-xs flex items-center gap-1"><span className="w-3 h-3 bg-amber-400 rounded"></span> Sakit</span>
              <span className="text-xs flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded"></span> Alpha</span>
            </div>
          </div>

          {/* Table per santri */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Rekap Kehadiran per Santri</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium text-xs">Santri</th>
                    <th className="text-center py-2 text-gray-500 font-medium text-xs">Hadir</th>
                    <th className="text-center py-2 text-gray-500 font-medium text-xs">Total</th>
                    <th className="text-center py-2 text-gray-500 font-medium text-xs">%</th>
                  </tr>
                </thead>
                <tbody>
                  {kehadiranPerSantri.map(s => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.jenisKelamin === 'L' ? 'bg-blue-500' : 'bg-pink-500'}`}>{s.nama.charAt(0)}</div>
                          <span className="text-gray-700 text-xs">{s.nama}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center text-emerald-600 font-medium text-xs">{s.hadir}</td>
                      <td className="py-2.5 text-center text-gray-600 text-xs">{s.total}</td>
                      <td className="py-2.5 text-center">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          s.persentase >= 80 ? 'bg-emerald-100 text-emerald-700' :
                          s.persentase >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>{s.persentase}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Hafalan Tab */}
      {activeTab === 'hafalan' && (
        <div className="space-y-4">
          {/* Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-gray-800">{hafalanData.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total Hafalan</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-emerald-600">{hafalanData.filter(h => h.status === 'lancar').length}</p>
              <p className="text-xs text-gray-500 mt-1">Lancar</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-purple-600">{Math.round(hafalanData.reduce((s, h) => s + h.nilai, 0) / hafalanData.length)}</p>
              <p className="text-xs text-gray-500 mt-1">Rata-rata Nilai</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-blue-600">{[...new Set(hafalanData.map(h => h.surat))].length}</p>
              <p className="text-xs text-gray-500 mt-1">Surat Dihafal</p>
            </div>
          </div>

          {/* Progress per santri */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Progress Hafalan per Santri</h3>
            <div className="space-y-3">
              {hafalanPerSantri.sort((a, b) => b.total - a.total).map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.jenisKelamin === 'L' ? 'bg-blue-500' : 'bg-pink-500'}`}>{s.nama.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 truncate">{s.nama}</span>
                      <span className="text-xs text-gray-500">{s.total} hafalan • Nilai: {s.avgNilai}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${(s.total / Math.max(...hafalanPerSantri.map(h => h.total))) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surat yang dihafal */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Daftar Surat yang Dihafal</h3>
            <div className="flex flex-wrap gap-2">
              {[...new Set(hafalanData.map(h => h.surat))].map(surat => (
                <span key={surat} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                  {surat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Iuran Tab */}
      {activeTab === 'iuran' && (
        <div className="space-y-4">
          {/* Financial Overview */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Ringkasan Keuangan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xs text-emerald-600">Total Terkumpul</p>
                <p className="text-lg font-bold text-emerald-700 mt-1">Rp {totalBayar.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-red-600">Sisa Tagihan</p>
                <p className="text-lg font-bold text-red-700 mt-1">Rp {(totalTagihan - totalBayar).toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress pengumpulan</span>
                <span>{Math.round((totalBayar / totalTagihan) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${(totalBayar / totalTagihan) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-700">{totalLunas}</p>
              <p className="text-xs text-emerald-600 mt-1">Lunas</p>
              <p className="text-[10px] text-gray-500">Rp {(totalLunas * 50000).toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
              <p className="text-2xl font-bold text-amber-700">{totalSebagian}</p>
              <p className="text-xs text-amber-600 mt-1">Sebagian</p>
              <p className="text-[10px] text-gray-500">Rp {iuranData.filter(i => i.status === 'sebagian').reduce((s, i) => s + i.jumlahBayar, 0).toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
              <p className="text-2xl font-bold text-red-700">{totalBelum}</p>
              <p className="text-xs text-red-600 mt-1">Belum Bayar</p>
              <p className="text-[10px] text-gray-500">Rp {(totalBelum * 50000).toLocaleString('id-ID')}</p>
            </div>
          </div>

          {/* Metode pembayaran */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Metode Pembayaran</h3>
            <div className="space-y-3">
              {[
                { label: 'Tunai', icon: '💵', count: iuranData.filter(i => i.metodeBayar === 'tunai' && i.status === 'lunas').length, color: 'bg-green-500' },
                { label: 'Transfer', icon: '🏦', count: iuranData.filter(i => i.metodeBayar === 'transfer' && i.status === 'lunas').length, color: 'bg-blue-500' },
                { label: 'QRIS', icon: '📱', count: iuranData.filter(i => i.metodeBayar === 'qris' && i.status === 'lunas').length, color: 'bg-purple-500' },
              ].map((method, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl">{method.icon}</span>
                  <span className="text-sm text-gray-600 flex-1">{method.label}</span>
                  <span className="text-sm font-semibold text-gray-800">{method.count} santri</span>
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${method.color} rounded-full`} style={{ width: `${(method.count / totalLunas) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail per santri */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Detail Iuran per Santri</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium text-xs">Santri</th>
                    <th className="text-right py-2 text-gray-500 font-medium text-xs">Tagihan</th>
                    <th className="text-right py-2 text-gray-500 font-medium text-xs">Bayar</th>
                    <th className="text-center py-2 text-gray-500 font-medium text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {iuranData.map(i => {
                    const santri = santriData.find(s => s.id === i.santriId);
                    return (
                      <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2.5 text-xs text-gray-700">{santri?.nama}</td>
                        <td className="py-2.5 text-right text-xs text-gray-600">Rp {i.jumlahTagihan.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 text-right text-xs font-medium text-gray-800">Rp {i.jumlahBayar.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            i.status === 'lunas' ? 'bg-emerald-100 text-emerald-700' :
                            i.status === 'sebagian' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {i.status === 'lunas' ? 'Lunas' : i.status === 'sebagian' ? 'Sebagian' : 'Belum'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Database Info */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 text-white">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
          Database SQL
        </h3>
        <p className="text-gray-300 text-sm mb-3">Sistem ini menggunakan database MySQL dengan 6 tabel utama:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['users', 'santri', 'hafalan', 'kehadiran', 'iuran', 'log_aktivitas'].map((table, i) => (
            <span key={i} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              {table}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
