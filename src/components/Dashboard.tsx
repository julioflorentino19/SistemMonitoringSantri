import { Page } from '../types';
import { santriData, hafalanData, kehadiranData, iuranData } from '../data';

interface DashboardProps { onNavigate: (page: Page) => void; }

export default function Dashboard({ onNavigate }: DashboardProps) {
  const totalSantri = santriData.length;
  const latestDate = kehadiranData.map(k => k.tanggal).sort().reverse()[0];
  const totalHadir = kehadiranData.filter(k => k.tanggal === latestDate && k.status === 'hadir').length;
  const totalHafalan = hafalanData.length;
  const totalLunas = iuranData.filter(i => i.status === 'lunas').length;
  const totalTerkumpul = iuranData.filter(i => i.status === 'lunas').reduce((s, i) => s + i.jumlahBayar, 0);
  const hafalanLancar = hafalanData.filter(h => h.status === 'lancar').length;
  const hafalanKurang = hafalanData.filter(h => h.status === 'kurang_lancar').length;
  const hafalanBelum = hafalanData.filter(h => h.status === 'belum_lancar').length;

  const stats = [
    { label: 'Total Santri', value: totalSantri, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700', page: 'santri' as Page, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Hadir Hari Ini', value: totalHadir, color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700', page: 'kehadiran' as Page, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { label: 'Total Hafalan', value: totalHafalan, color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700', page: 'hafalan' as Page, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'Iuran Terkumpul', value: `Rp ${(totalTerkumpul/1000).toFixed(0)}K`, color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-700', page: 'iuran' as Page, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Assalamu'alaikum 👋</h1>
          <p className="text-emerald-100 text-sm">Selamat datang di Sistem Informasi Data Santri</p>
          <p className="text-emerald-200 text-xs mt-1">Masjid Nurul Iman • {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <button key={i} onClick={() => onNavigate(stat.page)} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100">
            <div className={`${stat.lightColor} w-10 h-10 rounded-lg flex items-center justify-center ${stat.textColor} mb-3`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
            </div>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hafalan Progress */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">📖 Status Hafalan</h3>
            <button onClick={() => onNavigate('hafalan')} className="text-xs text-emerald-600 font-medium">Lihat Semua →</button>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Lancar', count: hafalanLancar, color: 'bg-emerald-500' },
              { label: 'Kurang Lancar', count: hafalanKurang, color: 'bg-amber-500' },
              { label: 'Belum Lancar', count: hafalanBelum, color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                <span className="text-sm font-semibold text-gray-800">{item.count}</span>
                <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.count / totalHafalan) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Iuran Summary */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">💰 Ringkasan Iuran</h3>
            <button onClick={() => onNavigate('iuran')} className="text-xs text-emerald-600 font-medium">Lihat Semua →</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-emerald-50 rounded-xl">
              <p className="text-xl font-bold text-emerald-600">{totalLunas}</p>
              <p className="text-xs text-gray-500 mt-1">Lunas</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <p className="text-xl font-bold text-amber-600">{iuranData.filter(i => i.status === 'sebagian').length}</p>
              <p className="text-xs text-gray-500 mt-1">Sebagian</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <p className="text-xl font-bold text-red-600">{iuranData.filter(i => i.status === 'belum_bayar').length}</p>
              <p className="text-xs text-gray-500 mt-1">Belum</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Terkumpul</span>
              <span className="text-sm font-bold text-emerald-600">Rp {totalTerkumpul.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">🕐 Aktivitas Terbaru</h3>
          <button onClick={() => onNavigate('laporan')} className="text-xs text-emerald-600 font-medium">Laporan →</button>
        </div>
        <div className="space-y-2">
          {hafalanData.slice(-5).reverse().map((record) => {
            const santri = santriData.find(s => s.id === record.santriId);
            return (
              <div key={record.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  record.status === 'lancar' ? 'bg-emerald-500' : record.status === 'kurang_lancar' ? 'bg-amber-500' : 'bg-red-500'
                }`}>{santri?.nama.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{santri?.nama}</p>
                  <p className="text-xs text-gray-500">QS. {record.surat} : {record.ayatMulai}-{record.ayatSelesai}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  record.status === 'lancar' ? 'bg-emerald-100 text-emerald-700' :
                  record.status === 'kurang_lancar' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>{record.status === 'lancar' ? 'Lancar' : record.status === 'kurang_lancar' ? 'Kurang' : 'Belum'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Waterfall Info */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 text-white">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Metode Waterfall
        </h3>
        <p className="text-gray-300 text-sm mb-3">Sistem dikembangkan dengan metode Waterfall:</p>
        <div className="flex flex-wrap gap-2">
          {['Analisis', 'Desain', 'Implementasi', 'Testing', 'Deployment'].map((step, i) => (
            <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs flex items-center gap-1">
              <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
