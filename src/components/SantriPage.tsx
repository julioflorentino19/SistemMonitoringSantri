import { useState } from 'react';
import { santriData } from '../data';
import { Santri } from '../types';

export default function SantriPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredSantri = santriData.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKelas = filterKelas === '' || s.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  const kelasList = [...new Set(santriData.map(s => s.kelas))];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Data Santri</h1>
          <p className="text-sm text-gray-500">Kelola data santri Masjid Nurul Iman</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Tambah Santri</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama atau ID santri..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-blue-700">{santriData.length}</p>
          <p className="text-xs text-blue-600">Total Santri</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-emerald-700">{santriData.filter(s => s.kelas === 'Kelas 1').length}</p>
          <p className="text-xs text-emerald-600">Kelas 1</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-purple-700">{santriData.filter(s => s.kelas === 'Kelas 2').length}</p>
          <p className="text-xs text-purple-600">Kelas 2</p>
        </div>
      </div>

      {/* Santri List */}
      <div className="space-y-3">
        {filteredSantri.map((santri) => (
          <div
            key={santri.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            onClick={() => { setSelectedSantri(santri); setShowModal(true); }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {santri.nama.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800 truncate">{santri.nama}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{santri.id}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {santri.kelas}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {santri.usia} tahun
                  </span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {filteredSantri.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500">Tidak ada santri ditemukan</p>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedSantri && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                  {selectedSantri.nama.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedSantri.nama}</h3>
                  <p className="text-emerald-100 text-sm">{selectedSantri.id} • {selectedSantri.kelas}</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Usia</p>
                  <p className="font-medium text-gray-800">{selectedSantri.usia} tahun</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kelas</p>
                  <p className="font-medium text-gray-800">{selectedSantri.kelas}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">No. HP</p>
                  <p className="font-medium text-gray-800">{selectedSantri.noHp}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Daftar</p>
                  <p className="font-medium text-gray-800">{new Date(selectedSantri.tanggalDaftar).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Alamat</p>
                <p className="font-medium text-gray-800">{selectedSantri.alamat}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors">
                  Edit Data
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
