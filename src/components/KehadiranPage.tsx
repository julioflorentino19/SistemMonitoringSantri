import { useState } from 'react';
import { kehadiranData, santriData, getSantriName } from '../data';

export default function KehadiranPage() {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredKehadiran = kehadiranData.filter(k => {
    const matchDate = k.tanggal === selectedDate;
    const matchStatus = filterStatus === '' || k.status === filterStatus;
    return matchDate && matchStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir':
        return (
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'izin':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        );
      case 'sakit':
        return (
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        );
      case 'alpha':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'hadir': return { text: 'Hadir', color: 'text-emerald-700 bg-emerald-50' };
      case 'izin': return { text: 'Izin', color: 'text-blue-700 bg-blue-50' };
      case 'sakit': return { text: 'Sakit', color: 'text-amber-700 bg-amber-50' };
      case 'alpha': return { text: 'Alpha', color: 'text-red-700 bg-red-50' };
      default: return { text: '', color: '' };
    }
  };

  // Get stats for selected date
  const dateKehadiran = kehadiranData.filter(k => k.tanggal === selectedDate);
  const hadirCount = dateKehadiran.filter(k => k.status === 'hadir').length;
  const izinCount = dateKehadiran.filter(k => k.status === 'izin').length;
  const sakitCount = dateKehadiran.filter(k => k.status === 'sakit').length;
  const alphaCount = dateKehadiran.filter(k => k.status === 'alpha').length;

  // Get unique dates
  const uniqueDates = [...new Set(kehadiranData.map(k => k.tanggal))].sort().reverse();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Kehadiran Santri</h1>
          <p className="text-sm text-gray-500">Monitor kehadiran harian santri</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Absensi</span>
        </button>
      </div>

      {/* Stats for selected date */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
          <p className="text-lg sm:text-xl font-bold text-emerald-700">{hadirCount}</p>
          <p className="text-[10px] sm:text-xs text-emerald-600">Hadir</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
          <p className="text-lg sm:text-xl font-bold text-blue-700">{izinCount}</p>
          <p className="text-[10px] sm:text-xs text-blue-600">Izin</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
          <p className="text-lg sm:text-xl font-bold text-amber-700">{sakitCount}</p>
          <p className="text-[10px] sm:text-xs text-amber-600">Sakit</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
          <p className="text-lg sm:text-xl font-bold text-red-700">{alphaCount}</p>
          <p className="text-[10px] sm:text-xs text-red-600">Alpha</p>
        </div>
      </div>

      {/* Absence Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Input Kehadiran</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tanggal</label>
              <input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Santri</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Pilih Santri</option>
                {santriData.map(s => (
                  <option key={s.id} value={s.id}>{s.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="hadir">Hadir</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="alpha">Alpha</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Keterangan</label>
              <input type="text" placeholder="Keterangan (opsional)" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Simpan
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {uniqueDates.map(d => (
              <option key={d} value={d}>{new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">Semua Status</option>
            <option value="hadir">Hadir</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
            <option value="alpha">Alpha</option>
          </select>
        </div>
      </div>

      {/* Attendance List */}
      <div className="space-y-2">
        {filteredKehadiran.map((record) => {
          const statusInfo = getStatusLabel(record.status);
          return (
            <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                {getStatusIcon(record.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800 text-sm">{getSantriName(record.santriId)}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  {record.keterangan && (
                    <p className="text-xs text-gray-500 mt-0.5">Keterangan: {record.keterangan}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(record.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredKehadiran.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">Tidak ada data kehadiran untuk tanggal ini</p>
        </div>
      )}

      {/* Attendance Rate */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">Tingkat Kehadiran</h3>
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Persentase kehadiran</span>
            <span className="text-xs font-semibold text-emerald-600">
              {dateKehadiran.length > 0 ? Math.round((hadirCount / dateKehadiran.length) * 100) : 0}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${dateKehadiran.length > 0 ? (hadirCount / dateKehadiran.length) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-400">
            <span>Total: {dateKehadiran.length} santri</span>
            <span>Hadir: {hadirCount} santri</span>
          </div>
        </div>
      </div>
    </div>
  );
}
