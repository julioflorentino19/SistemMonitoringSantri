import { useState } from 'react';
import { iuranData, santriData, getSantriName } from '../data';

export default function IuranPage() {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSantri, setFilterSantri] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = iuranData.filter(i => {
    const matchStatus = filterStatus === '' || i.status === filterStatus;
    const matchSantri = filterSantri === '' || i.santriId === filterSantri;
    return matchStatus && matchSantri;
  });

  const totalLunas = iuranData.filter(i => i.status === 'lunas').length;
  const totalSebagian = iuranData.filter(i => i.status === 'sebagian').length;
  const totalBelum = iuranData.filter(i => i.status === 'belum_bayar').length;
  const totalTerkumpul = iuranData.filter(i => i.status === 'lunas').reduce((sum, i) => sum + i.jumlahBayar, 0);
  const totalTagihan = iuranData.reduce((sum, i) => sum + i.jumlahTagihan, 0);
  const totalSisa = totalTagihan - iuranData.reduce((sum, i) => sum + i.jumlahBayar, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">💰 Iuran Bulanan</h1>
          <p className="text-sm text-gray-500">Kelola pembayaran iuran santri</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span className="hidden sm:inline">Catat</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <p className="text-emerald-100 text-xs">Total Terkumpul Bulan Ini</p>
          <p className="text-2xl font-bold mt-1">Rp {totalTerkumpul.toLocaleString('id-ID')}</p>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-white rounded-full" style={{ width: `${(totalTerkumpul / totalTagihan) * 100}%` }}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-emerald-100">
            <span>{Math.round((totalTerkumpul / totalTagihan) * 100)}% tercapai</span>
            <span>Sisa: Rp {totalSisa.toLocaleString('id-ID')}</span>
          </div>
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
          <p className="text-xs text-red-600">Belum</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">💵 Catat Pembayaran</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Santri</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Pilih Santri</option>
                {santriData.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Bulan</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Jumlah Bayar (Rp)</label>
              <input type="number" placeholder="50000" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Metode Bayar</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="tunai">Tunai</option>
                <option value="transfer">Transfer</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tanggal Bayar</label>
              <input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Keterangan</label>
              <input type="text" placeholder="Opsional" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
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
            <option value="lunas">Lunas</option>
            <option value="sebagian">Sebagian</option>
            <option value="belum_bayar">Belum Bayar</option>
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
                  record.status === 'lunas' ? 'bg-emerald-500' : record.status === 'sebagian' ? 'bg-amber-500' : 'bg-red-500'
                }`}>{getSantriName(record.santriId).charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-800 text-sm">{getSantriName(record.santriId)}</h4>
                    {record.status === 'lunas' && <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">✓ Lunas</span>}
                    {record.status === 'sebagian' && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">~ Sebagian</span>}
                    {record.status === 'belum_bayar' && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">✗ Belum</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs text-gray-600">📅 {record.bulan} {record.tahun}</span>
                    <span className="text-xs font-semibold text-gray-700">Rp {record.jumlahBayar.toLocaleString('id-ID')} / {record.jumlahTagihan.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      record.metodeBayar === 'tunai' ? 'bg-green-50 text-green-600' :
                      record.metodeBayar === 'transfer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {record.metodeBayar === 'tunai' ? '💵 Tunai' : record.metodeBayar === 'transfer' ? '🏦 Transfer' : '📱 QRIS'}
                    </span>
                    {record.tanggalBayar && <span className="text-xs text-gray-400">{new Date(record.tanggalBayar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>}
                  </div>
                </div>
              </div>
              {record.status !== 'lunas' && (
                <button className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-100 transition-colors whitespace-nowrap">Bayar</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12"><p className="text-gray-500">Tidak ada data iuran ditemukan</p></div>
      )}
    </div>
  );
}
