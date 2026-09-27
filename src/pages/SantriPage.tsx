import { useState } from 'react';
import { db, getUsia, Santri } from '../db';

const Modal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default function SantriPage({ setToast }: { setToast: (t: { msg: string; type: 'success' | 'error' } | null) => void }) {
  const [data, setData] = useState(db.getSantri());
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'view'; item?: Santri }>({ open: false, mode: 'view' });
  const [form, setForm] = useState<Partial<Santri>>({});

  const refresh = () => setData(db.getSantri());
  const filtered = data.filter(s => (s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)) && (filterKelas === '' || s.kelas === filterKelas));
  const kelasList = [...new Set(data.map(s => s.kelas))];

  const openAdd = () => { setForm({ jenisKelamin: 'L', kelas: 'Kelas 1', status: 'aktif', tanggalDaftar: new Date().toISOString().split('T')[0] }); setModal({ open: true, mode: 'add' }); };
  const openEdit = (s: Santri) => { setForm(s); setModal({ open: true, mode: 'edit', item: s }); };
  const openView = (s: Santri) => { setForm(s); setModal({ open: true, mode: 'view', item: s }); };

  const handleSave = () => {
    if (!form.nama || !form.nis || !form.kelas) { setToast({ msg: 'Lengkapi data wajib!', type: 'error' }); return; }
    if (modal.mode === 'add') {
      db.addSantri({ nis: form.nis!, nama: form.nama!, namaPanggilan: form.namaPanggilan || '', jenisKelamin: (form.jenisKelamin || 'L') as 'L' | 'P', tempatLahir: form.tempatLahir || '', tanggalLahir: form.tanggalLahir || '', alamat: form.alamat || '', kelurahan: form.kelurahan || '', kecamatan: form.kecamatan || '', kota: form.kota || '', noHpWali: form.noHpWali || '', namaWali: form.namaWali || '', kelas: form.kelas!, tanggalDaftar: form.tanggalDaftar || new Date().toISOString().split('T')[0], status: (form.status || 'aktif') as 'aktif' | 'alumni' | 'nonaktif' });
      setToast({ msg: 'Santri berhasil ditambahkan!', type: 'success' });
    } else {
      db.updateSantri(modal.item!.id, form);
      setToast({ msg: 'Data santri berhasil diupdate!', type: 'success' });
    }
    refresh(); setModal({ open: false, mode: 'view' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin hapus data santri ini?')) { db.deleteSantri(id); refresh(); setToast({ msg: 'Santri berhasil dihapus!', type: 'success' }); setModal({ open: false, mode: 'view' }); }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-800">👥 Data Santri</h1><p className="text-sm text-gray-500">Kelola data santri</p></div>
        <button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg><span className="hidden sm:inline">Tambah</span></button>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Cari nama/NIS..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/>
        </div>
        <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
          <option value="">Semua Kelas</option>{kelasList.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${s.jenisKelamin === 'L' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'}`}>{s.nama.charAt(0)}</div>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openView(s)}>
                <div className="flex items-center gap-2 flex-wrap"><h3 className="font-semibold text-gray-800">{s.nama}</h3><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.nis}</span></div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><span>{s.kelas}</span><span>•</span><span>{getUsia(s.tanggalLahir)} thn</span><span>•</span><span className={s.jenisKelamin === 'L' ? 'text-blue-600' : 'text-pink-600'}>{s.jenisKelamin === 'L' ? 'L' : 'P'}</span></div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="Edit"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600" title="Hapus"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Tidak ada data</div>}
      </div>

      <Modal open={modal.open && modal.mode !== 'view'} onClose={() => setModal({ open: false, mode: 'view' })} title={modal.mode === 'add' ? '➕ Tambah Santri' : '✏️ Edit Santri'}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">NIS *</label><input type="text" value={form.nis || ''} onChange={e => setForm({ ...form, nis: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/></div>
            <div><label className="text-xs text-gray-500">Nama Panggilan</label><input type="text" value={form.namaPanggilan || ''} onChange={e => setForm({ ...form, namaPanggilan: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/></div>
          </div>
          <div><label className="text-xs text-gray-500">Nama Lengkap *</label><input type="text" value={form.nama || ''} onChange={e => setForm({ ...form, nama: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Jenis Kelamin</label><select value={form.jenisKelamin || 'L'} onChange={e => setForm({ ...form, jenisKelamin: e.target.value as 'L' | 'P' })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
            <div><label className="text-xs text-gray-500">Kelas *</label><select value={form.kelas || 'Kelas 1'} onChange={e => setForm({ ...form, kelas: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"><option>Kelas 1</option><option>Kelas 2</option><option>Kelas 3</option><option>Kelas 4</option><option>Kelas 5</option><option>Kelas 6</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Tempat Lahir</label><input type="text" value={form.tempatLahir || ''} onChange={e => setForm({ ...form, tempatLahir: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/></div>
            <div><label className="text-xs text-gray-500">Tanggal Lahir</label><input type="date" value={form.tanggalLahir || ''} onChange={e => setForm({ ...form, tanggalLahir: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/></div>
          </div>
          <div><label className="text-xs text-gray-500">Alamat</label><textarea value={form.alamat || ''} onChange={e => setForm({ ...form, alamat: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" rows={2}/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Nama Wali</label><input type="text" value={form.namaWali || ''} onChange={e => setForm({ ...form, namaWali: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/></div>
            <div><label className="text-xs text-gray-500">No. HP Wali</label><input type="text" value={form.noHpWali || ''} onChange={e => setForm({ ...form, noHpWali: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/></div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-medium">Simpan</button>
            <button onClick={() => setModal({ open: false, mode: 'view' })} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium">Batal</button>
          </div>
        </div>
      </Modal>

      <Modal open={modal.open && modal.mode === 'view' && !!modal.item} onClose={() => setModal({ open: false, mode: 'view' })} title="Detail Santri">
        {modal.item && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-gray-100">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2 ${modal.item.jenisKelamin === 'L' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'}`}>{modal.item.nama.charAt(0)}</div>
              <h3 className="font-bold text-gray-800">{modal.item.nama}</h3>
              <p className="text-sm text-gray-500">NIS: {modal.item.nis} • {modal.item.kelas}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-gray-500">Panggilan</p><p className="font-medium">{modal.item.namaPanggilan}</p></div>
              <div><p className="text-xs text-gray-500">Usia</p><p className="font-medium">{getUsia(modal.item.tanggalLahir)} tahun</p></div>
              <div><p className="text-xs text-gray-500">TTL</p><p className="font-medium">{modal.item.tempatLahir}, {new Date(modal.item.tanggalLahir).toLocaleDateString('id-ID')}</p></div>
              <div><p className="text-xs text-gray-500">Jenis Kelamin</p><p className="font-medium">{modal.item.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p></div>
            </div>
            <div className="border-t pt-3"><p className="text-xs text-gray-500">Alamat</p><p className="font-medium text-sm">{modal.item.alamat}, {modal.item.kelurahan}, {modal.item.kecamatan}, {modal.item.kota}</p></div>
            <div className="border-t pt-3 grid grid-cols-2 gap-3"><div><p className="text-xs text-gray-500">Wali</p><p className="font-medium text-sm">{modal.item.namaWali}</p></div><div><p className="text-xs text-gray-500">No. HP</p><p className="font-medium text-sm">{modal.item.noHpWali}</p></div></div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => openEdit(modal.item!)} className="flex-1 bg-blue-50 text-blue-700 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-100">Edit</button>
              <button onClick={() => handleDelete(modal.item!.id)} className="flex-1 bg-red-50 text-red-700 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100">Hapus</button>
              <button onClick={() => setModal({ open: false, mode: 'view' })} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200">Tutup</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
