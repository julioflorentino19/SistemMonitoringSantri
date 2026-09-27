import { useState } from 'react';
import { hafalanData, santriData, getSantriName } from '../data';
import { HafalanRecord } from '../types';

export default function HafalanPage() {
  const [filterSantri, setFilterSantri] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredHafalan = hafalanData.filter(h => {
    const matchSantri = filterSantri === '' || h.santriId === filterSantri;
    const matchStatus = filterStatus === '' || h.status === filterStatus;
    return matchSantri && matchStatus;
  });

  const getStatusBadge = (status: HafalanRecord['status']) => {
    switch (status) {
      case 'lancar':
        return <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">✓ Lancar</span>;
      case 'kurang_lancar':
        return <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">~ Kurang Lancar</span>;
      case 'belum_lancar':
        return <span className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">✗ Belum Lancar</span>;
    }
  };

  const totalLancar = hafalanData.filter(h => h.status === 'lancar').length;
  const totalKurang = hafalanData.filter(h => h.status === 'kurang_lancar').length;
  const totalBelum = hafalanData.filter(h => h.status === 'belum_lancar').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Monitoring Hafalan</h1>
          <p className="text-sm text-gray-500">Pantau progress hafalan Al-Quran santri</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Catat Hafalan</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
          <p className="text-xl font-bold text-emerald-700">{totalLancar}</p>
          <p className="text-xs text-emerald-600">Lancar</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
          <p className="text-xl font-bold text-amber-700">{totalKurang}</p>
          <p className="text-xs text-amber-600">Kurang Lancar</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
          <p className="text-xl font-bold text-red-700">{totalBelum}</p>
          <p className="text-xs text-red-600">Belum Lancar</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Catat Hafalan Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <label className="text-xs text-gray-500 mb-1 block">Tanggal</label>
              <input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Surat</label>
              <input type="text" placeholder="Nama surat" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ayat</label>
              <input type="text" placeholder="Contoh: 1-10" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Juz</label>
              <input type="number" placeholder="Nomor juz" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="lancar">Lancar</option>
                <option value="kurang_lancar">Kurang Lancar</option>
                <option value="belum_lancar">Belum Lancar</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Catatan</label>
              <textarea placeholder="Catatan tambahan..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" rows={2}></textarea>
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
            value={filterSantri}
            onChange={(e) => setFilterSantri(e.target.value)}
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">Semua Santri</option>
            {santriData.map(s => (
              <option key={s.id} value={s.id}>{s.nama}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">Semua Status</option>
            <option value="lancar">Lancar</option>
            <option value="kurang_lancar">Kurang Lancar</option>
            <option value="belum_lancar">Belum Lancar</option>
          </select>
        </div>
      </div>

      {/* Hafalan List */}
      <div className="space-y-3">
        {filteredHafalan.map((record) => (
          <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  record.status === 'lancar' ? 'bg-emerald-500' : record.status === 'kurang_lancar' ? 'bg-amber-500' : 'bg-red-500'
                }`}>
                  {getSantriName(record.santriId).charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-800 text-sm">{getSantriName(record.santriId)}</h4>
                    {getStatusBadge(record.status)}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      QS. {record.surat}
                    </span>
                    <span className="text-xs text-gray-500">Ayat {record.ayat}</span>
                    <span className="text-xs text-gray-500">Juz {record.juz}</span>
                  </div>
                  {record.catatan && (
                    <p className="text-xs text-gray-500 mt-1.5 italic">"{record.catatan}"</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(record.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredHafalan.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-500">Belum ada data hafalan</p>
        </div>
      )}
    </div>
  );
}
