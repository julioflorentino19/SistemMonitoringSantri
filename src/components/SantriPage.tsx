import { useState } from 'react';
import { santriData, getUsia } from '../data';
import { Santri } from '../types';

export default function SantriPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = santriData.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm);
    const matchKelas = filterKelas === '' || s.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  const kelasList = [...new Set(santriData.map(s => s.kelas))];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Data Santri</h1>
          <p className="text-sm text-gray-500">Kelola data santri Masjid Nurul Iman</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Cari nama atau NIS..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm" />
          </div>
          <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
            <option value="">Semua Kelas</option>
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
          <p className="text-lg font-bold text-blue-700">{santriData.length}</p>
          <p className="text-xs text-blue-600">Total</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
          <p className="text-lg font-bold text-emerald-700">{santriData.filter(s => s.kelas === 'Kelas 1').length}</p>
          <p className="text-xs text-emerald-600">Kelas 1</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
          <p className="text-lg font-bold text-purple-700">{santriData.filter(s => s.kelas === 'Kelas 2').length}</p>
          <p className="text-xs text-purple-600">Kelas 2</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
          <p className="text-lg font-bold text-amber-700">{santriData.filter(s => s.kelas === 'Kelas 3').length}</p>
          <p className="text-xs text-amber-600">Kelas 3</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((santri) => (
          <div key={santri.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer" onClick={() => { setSelectedSantri(santri); setShowModal(true); }}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${santri.jenisKelamin === 'L' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'}`}>
                {santri.nama.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-800 truncate">{santri.nama}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{santri.nis}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-gray-500">{santri.kelas}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{getUsia(santri.tanggalLahir)} tahun</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${santri.jenisKelamin === 'L' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                    {santri.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada santri ditemukan</p>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedSantri && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl text-white">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm ${selectedSantri.jenisKelamin === 'L' ? 'bg-blue-500/30' : 'bg-pink-500/30'}`}>
                  {selectedSantri.nama.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedSantri.nama}</h3>
                  <p className="text-emerald-100 text-sm">NIS: {selectedSantri.nis} • {selectedSantri.kelas}</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Nama Panggilan</p><p className="font-medium text-gray-800 text-sm">{selectedSantri.namaPanggilan}</p></div>
                <div><p className="text-xs text-gray-500">Usia</p><p className="font-medium text-gray-800 text-sm">{getUsia(selectedSantri.tanggalLahir)} tahun</p></div>
                <div><p className="text-xs text-gray-500">Tempat, Tgl Lahir</p><p className="font-medium text-gray-800 text-sm">{selectedSantri.tempatLahir}, {new Date(selectedSantri.tanggalLahir).toLocaleDateString('id-ID')}</p></div>
                <div><p className="text-xs text-gray-500">Jenis Kelamin</p><p className="font-medium text-gray-800 text-sm">{selectedSantri.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p></div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500">Alamat</p>
                <p className="font-medium text-gray-800 text-sm">{selectedSantri.alamat}, {selectedSantri.kelurahan}, {selectedSantri.kecamatan}, {selectedSantri.kota}</p>
              </div>
              <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Nama Wali</p><p className="font-medium text-gray-800 text-sm">{selectedSantri.namaWali}</p></div>
                <div><p className="text-xs text-gray-500">No. HP Wali</p><p className="font-medium text-gray-800 text-sm">{selectedSantri.noHpWali}</p></div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex gap-2">
                <button className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors">Edit Data</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
