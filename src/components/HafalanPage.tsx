import { useState } from 'react';
import { hafalanData, santriData, getSantriName } from '../data';
import { HafalanRecord } from '../types';

export default function HafalanPage() {
  const [filterSantri, setFilterSantri] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = hafalanData.filter(h => {
    const matchSantri = filterSantri === '' || h.santriId === filterSantri;
    const matchStatus = filterStatus === '' || h.status === filterStatus;
    return matchSantri && matchStatus;
  });

  const getStatusBadge = (status: HafalanRecord['status']) => {
    switch (status) {
      case 'lancar': return <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">✓ Lancar</span>;
      case 'kurang_lancar': return <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">~ Kurang</span>;
      case 'belum_lancar': return <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">✗ Belum</span>;
    }
  };

  const totalLancar = hafalanData.filter(h => h.status === 'lancar').length;
  const totalKurang = hafalanData.filter(h => h.status === 'kurang_lancar').length;
  const totalBelum = hafalanData.filter(h => h.status === 'belum_lancar').length;
  const avgNilai = Math.round(hafalanData.reduce((s, h) => s + h.nilai, 0) / hafalanData.length);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">📖 Monitoring Hafalan</h1>
          <p className="text-sm text-gray-500">Pantau progress hafalan Al-Quran santri</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span className="hidden sm:inline">Catat</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
          <p className="text-lg font-bold text-emerald-700">{totalLancar}</p>
          <p className="text-[10px] sm:text-xs text-emerald-600">Lancar</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
          <p className="text-lg font-bold text-amber-700">{totalKurang}</p>
          <p className="text-[10px] sm:text-xs text-amber-600">Kurang</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
          <p className="text-lg font-bold text-red-700">{totalBelum}</p>
          <p className="text-[10px] sm:text-xs text-red-600">Belum</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
          <p className="text-lg font-bold text-purple-700">{avgNilai}</p>
          <p className="text-[10px] sm:text-xs text-purple-600">Rata²</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">📝 Catat Hafalan Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Santri</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Pilih Santri</option>
                {santriData.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
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
              <label className="text-xs text-gray-500 mb-1 block">Ayat (dari - sampai)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Dari" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                <input type="number" placeholder="Sampai" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Juz</label>
              <input type="number" placeholder="Nomor juz" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nilai (0-100)</label>
              <input type="number" placeholder="85" min="0" max="100" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="lancar">Lancar</option>
                <option value="kurang_lancar">Kurang Lancar</option>
                <option value="belum_lancar">Belum Lancar</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Penguji</label>
              <input type="text" placeholder="Nama penguji" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Catatan</label>
              <textarea placeholder="Catatan tambahan..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" rows={2}></textarea>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">Simpan</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">Batal</button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={filterSantri} onChange={(e) => setFilterSantri(e.target.value)} className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="">Semua Santri</option>
            {santriData.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="">Semua Status</option>
            <option value="lancar">Lancar</option>
            <option value="kurang_lancar">Kurang Lancar</option>
            <option value="belum_lancar">Belum Lancar</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((record) => (
          <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  record.status === 'lancar' ? 'bg-emerald-500' : record.status === 'kurang_lancar' ? 'bg-amber-500' : 'bg-red-500'
                }`}>{getSantriName(record.santriId).charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-800 text-sm">{getSantriName(record.santriId)}</h4>
                    {getStatusBadge(record.status)}
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{record.nilai}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs text-gray-600">📖 QS. {record.surat}</span>
                    <span className="text-xs text-gray-500">Ayat {record.ayatMulai}-{record.ayatSelesai}</span>
                    <span className="text-xs text-gray-500">Juz {record.juz}</span>
                  </div>
                  {record.catatan && <p className="text-xs text-gray-500 mt-1.5 italic">"{record.catatan}"</p>}
                </div>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(record.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12"><p className="text-gray-500">Belum ada data hafalan</p></div>
      )}
    </div>
  );
}
