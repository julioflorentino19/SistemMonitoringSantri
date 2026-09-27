import { useState } from 'react';
import { iuranData, santriData, getSantriName } from '../data';

export default function IuranPage() {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSantri, setFilterSantri] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredIuran = iuranData.filter(i => {
    const matchStatus = filterStatus === '' || i.status === filterStatus;
    const matchSantri = filterSantri === '' || i.santriId === filterSantri;
    return matchStatus && matchSantri;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lunas':
        return <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">✓ Lunas</span>;
      case 'sebagian':
        return <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">~ Sebagian</span>;
      case 'belum_bayar':
        return <span className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">✗ Belum Bayar</span>;
      default:
        return null;
    }
  };

  const totalLunas = iuranData.filter(i => i.status === 'lunas').length;
  const totalSebagian = iuranData.filter(i => i.status === 'sebagian').length;
  const totalBelum = iuranData.filter(i => i.status === 'belum_bayar').length;
  const totalTerkumpul = iuranData.filter(i => i.status === 'lunas').reduce((sum, i) => sum + i.jumlah, 0);
  const totalTarget = iuranData.length * 50000;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Iuran Bulanan</h1>
          <p className="text-sm text-gray-500">Kelola pembayaran iuran santri</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Catat Bayar</span>
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-emerald-100 text-xs">Total Terkumpul Bulan Ini</p>
            <p className="text-2xl font-bold mt-1">Rp {totalTerkumpul.toLocaleString('id-ID')}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${(totalTerkumpul / totalTarget) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-emerald-100">
          <span>{Math.round((totalTerkumpul / totalTarget) * 100)}% tercapai</span>
          <span>Target: Rp {totalTarget.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
          <p className="text-xl font-bold text-emerald-700">{totalLunas}</p>
          <p className="text-xs text-emerald-600">Lunas</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
          <p className="text-xl font-bold text-amber-700">{totalSebagian}</p>
          <p className="text-xs text-amber-600">Sebagian</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
          <p className="text-xl font-bold text-red-700">{totalBelum}</p>
          <p className="text-xs text-red-600">Belum Bayar</p>
        </div>
      </div>

      {/* Payment Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Catat Pembayaran</h3>
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
              <label className="text-xs text-gray-500 mb-1 block">Bulan</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="Januari">Januari</option>
                <option value="Februari">Februari</option>
                <option value="Maret">Maret</option>
                <option value="April">April</option>
                <option value="Mei">Mei</option>
                <option value="Juni">Juni</option>
                <option value="Juli">Juli</option>
                <option value="Agustus">Agustus</option>
                <option value="September">September</option>
                <option value="Oktober">Oktober</option>
                <option value="November">November</option>
                <option value="Desember">Desember</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Jumlah (Rp)</label>
              <input type="number" placeholder="50000" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="lunas">Lunas</option>
                <option value="sebagian">Sebagian</option>
                <option value="belum_bayar">Belum Bayar</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tanggal Bayar</label>
              <input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
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
            <option value="lunas">Lunas</option>
            <option value="sebagian">Sebagian</option>
            <option value="belum_bayar">Belum Bayar</option>
          </select>
        </div>
      </div>

      {/* Iuran List */}
      <div className="space-y-3">
        {filteredIuran.map((record) => (
          <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  record.status === 'lunas' ? 'bg-emerald-500' : record.status === 'sebagian' ? 'bg-amber-500' : 'bg-red-500'
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {record.bulan} {record.tahun}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      Rp {record.jumlah.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {record.tanggalBayar && (
                    <p className="text-xs text-gray-400 mt-1">
                      Dibayar: {new Date(record.tanggalBayar).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              {record.status !== 'lunas' && (
                <button className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-100 transition-colors whitespace-nowrap">
                  Bayar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredIuran.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">Tidak ada data iuran ditemukan</p>
        </div>
      )}

      {/* Summary Table */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">Ringkasan Per Bulan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium text-xs">Bulan</th>
                <th className="text-center py-2 text-gray-500 font-medium text-xs">Lunas</th>
                <th className="text-center py-2 text-gray-500 font-medium text-xs">Belum</th>
                <th className="text-right py-2 text-gray-500 font-medium text-xs">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-2 text-gray-700">Januari 2024</td>
                <td className="py-2 text-center text-emerald-600 font-medium">{totalLunas}</td>
                <td className="py-2 text-center text-red-600 font-medium">{totalBelum + totalSebagian}</td>
                <td className="py-2 text-right font-medium text-gray-800">Rp {totalTerkumpul.toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
