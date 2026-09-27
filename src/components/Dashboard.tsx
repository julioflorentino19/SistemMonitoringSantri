import { Page } from '../types';
import { santriData, hafalanData, kehadiranData, iuranData } from '../data';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const totalSantri = santriData.length;
  const totalHadir = kehadiranData.filter(k => k.status === 'hadir').length;
  const totalHafalan = hafalanData.length;
  const totalLunas = iuranData.filter(i => i.status === 'lunas').length;
  const totalBelumBayar = iuranData.filter(i => i.status === 'belum_bayar').length;

  const hafalanLancar = hafalanData.filter(h => h.status === 'lancar').length;
  const hafalanKurang = hafalanData.filter(h => h.status === 'kurang_lancar').length;
  const hafalanBelum = hafalanData.filter(h => h.status === 'belum_lancar').length;

  const stats = [
    {
      label: 'Total Santri',
      value: totalSantri,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      page: 'santri' as Page,
    },
    {
      label: 'Hadir Hari Ini',
      value: totalHadir,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      page: 'kehadiran' as Page,
    },
    {
      label: 'Total Hafalan',
      value: totalHafalan,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      page: 'hafalan' as Page,
    },
    {
      label: 'Iuran Lunas',
      value: totalLunas,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      page: 'iuran' as Page,
    },
  ];

  const recentHafalan = hafalanData.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">Assalamu'alaikum 👋</h1>
            <p className="text-emerald-100 text-sm">Selamat datang di Sistem Informasi Data Santri</p>
            <p className="text-emerald-200 text-xs mt-1">Masjid Nurul Iman</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <button
            key={index}
            onClick={() => onNavigate(stat.page)}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left border border-gray-100 hover:border-gray-200"
          >
            <div className={`${stat.lightColor} w-10 h-10 rounded-lg flex items-center justify-center ${stat.textColor} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Hafalan Progress */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Status Hafalan</h3>
            <button onClick={() => onNavigate('hafalan')} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              Lihat Semua →
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600 flex-1">Lancar</span>
              <span className="text-sm font-semibold text-gray-800">{hafalanLancar}</span>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(hafalanLancar / totalHafalan) * 100}%` }}></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-gray-600 flex-1">Kurang Lancar</span>
              <span className="text-sm font-semibold text-gray-800">{hafalanKurang}</span>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(hafalanKurang / totalHafalan) * 100}%` }}></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600 flex-1">Belum Lancar</span>
              <span className="text-sm font-semibold text-gray-800">{hafalanBelum}</span>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${(hafalanBelum / totalHafalan) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Iuran Summary */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Ringkasan Iuran</h3>
            <button onClick={() => onNavigate('iuran')} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              Lihat Semua →
            </button>
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
              <p className="text-xl font-bold text-red-600">{totalBelumBayar}</p>
              <p className="text-xs text-gray-500 mt-1">Belum Bayar</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Terkumpul</span>
              <span className="text-sm font-bold text-emerald-600">
                Rp {(totalLunas * 50000).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Aktivitas Hafalan Terbaru</h3>
          <button onClick={() => onNavigate('hafalan')} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
            Lihat Semua →
          </button>
        </div>
        <div className="space-y-3">
          {recentHafalan.map((record) => {
            const santri = santriData.find(s => s.id === record.santriId);
            return (
              <div key={record.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  record.status === 'lancar' ? 'bg-emerald-500' : record.status === 'kurang_lancar' ? 'bg-amber-500' : 'bg-red-500'
                }`}>
                  {santri?.nama.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{santri?.nama}</p>
                  <p className="text-xs text-gray-500">QS. {record.surat} : {record.ayat}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  record.status === 'lancar' ? 'bg-emerald-100 text-emerald-700' :
                  record.status === 'kurang_lancar' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {record.status === 'lancar' ? 'Lancar' : record.status === 'kurang_lancar' ? 'Kurang' : 'Belum'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Waterfall Method Info */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 text-white">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Metode Pengembangan: Waterfall
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          Sistem ini dikembangkan menggunakan metode Waterfall dengan tahapan: Analisis Kebutuhan → Desain → Implementasi → Testing → Deployment
        </p>
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
