import { useState } from 'react';
import { db, getSantriName, Hafalan } from '../db';

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

export default function HafalanPage({ setToast }: { setToast: (t: { msg: string; type: 'success' | 'error' } | null) => void }) {
  const [data, setData] = useState(db.getHafalan());
  const santriList = db.getSantri();
  const [filterSantri, setFilterSantri] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; item?: Hafalan }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Partial<Hafalan>>({});

  const refresh = () => setData(db.getHafalan());
  const filtered = data.filter(h => (!filterSantri || h.santriId === filterSantri) && (!filterStatus || h.status === filterStatus));

  const openAdd = () => { setForm({ tanggal: new Date().toISOString().split('T')[0], status: 'lancar', nilai: 80, penguji: 'Ustadz Ali' }); setModal({ open: true, mode: 'add' }); };
  const openEdit = (h: Hafalan) => { setForm(h); setModal({ open: true, mode: 'edit', item: h }); };

  const handleSave = () => {
    if (!form.santriId || !form.surat || !form.tanggal) { setToast({ msg: 'Lengkapi data!', type: 'error' }); return; }
    if (modal.mode === 'add') {
      db.addHafalan({ santriId: form.santriId!, tanggal: form.tanggal!, surat: form.surat!, ayatMulai: form.ayatMulai || 1, ayatSelesai: form.ayatSelesai || 10, juz: form.juz || 1, status: (form.status || 'lancar') as any, nilai: form.nilai || 80, catatan: form.catatan || '', penguji: form.penguji || '' });
      setToast({ msg: 'Hafalan berhasil dicatat!', type: 'success' });
    } else {
      db.updateHafalan(modal.item!.id, form);
      setToast({ msg: 'Hafalan berhasil diupdate!', type: 'success' });
    }
    refresh(); setModal({ open: false, mode: 'add' });
  };

  const handleDelete = (id: string) => { if (confirm('Hapus data hafalan?')) { db.deleteHafalan(id); refresh(); setToast({ msg: 'Data dihapus!', type: 'success' }); } };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-800">📖 Monitoring Hafalan</h1><p className="text-sm text-gray-500">Catat & pantau hafalan santri</p></div>
        <button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg><span className="hidden sm:inline">Catat</span></button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100"><p className="text-lg font-bold text-emerald-700">{data.filter(h => h.status === 'lancar').length}</p><p className="text-[10px] text-emerald-600">Lancar</p></div>
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100"><p className="text-lg font-bold text-amber-700">{data.filter(h => h.status === 'kurang_lancar').length}</p><p className="text-[10px] text-amber-600">Kurang</p></div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100"><p className="text-lg font-bold text-red-700">{data.filter(h => h.status === 'belum_lancar').length}</p><p className="text-[10px] text-red-600">Belum</p></div>
        <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100"><p className="text-lg font-bold text-purple-700">{Math.round(data.reduce((s, h) => s + h.nilai, 0) / (data.length || 1))}</p><p className="text-[10px] text-purple-600">Rata²</p></div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <select value={filterSantri} onChange={e => setFilterSantri(e.target.value)} className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"><option value="">Semua Santri</option>{santriList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}</select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"><option value="">Semua Status</option><option value="lancar">Lancar</option><option value="kurang_lancar">Kurang</option><option value="belum_lancar">Belum</option></select>
      </div>
      <div className="space-y-2">
        {filtered.map(h => (
          <div key={h.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${h.status === 'lancar' ? 'bg-emerald-500' : h.status === 'kurang_lancar' ? 'bg-amber-500' : 'bg-red-500'}`}>{getSantriName(h.santriId).charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap"><h4 className="font-semibold text-gray-800 text-sm">{getSantriName(h.santriId)}</h4><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${h.status === 'lancar' ? 'bg-emerald-100 text-emerald-700' : h.status === 'kurang_lancar' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{h.status === 'lancar' ? '✓ Lancar' : h.status === 'kurang_lancar' ? '~ Kurang' : '✗ Belum'}</span><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{h.nilai}</span></div>
                  <p className="text-xs text-gray-600 mt-1">📖 QS. {h.surat} : {h.ayatMulai}-{h.ayatSelesai} • Juz {h.juz}</p>
                  {h.catatan && <p className="text-xs text-gray-500 mt-1 italic">"{h.catatan}"</p>}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => openEdit(h)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                <button onClick={() => handleDelete(h.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: 'add' })} title={modal.mode === 'add' ? '➕ Catat Hafalan' : '✏️ Edit Hafalan'}>
        <div className="space-y-3">
          <div><label className="text-xs text-gray-500">Santri *</label><select value={form.santriId || ''} onChange={e => setForm({ ...form, santriId: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"><option value="">Pilih Santri</option>{santriList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Tanggal</label><input type="date" value={form.tanggal || ''} onChange={e => setForm({ ...form, tanggal: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
            <div><label className="text-xs text-gray-500">Surat *</label><input type="text" value={form.surat || ''} onChange={e => setForm({ ...form, surat: e.target.value })} placeholder="Al-Baqarah" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs text-gray-500">Ayat Dari</label><input type="number" value={form.ayatMulai || ''} onChange={e => setForm({ ...form, ayatMulai: +e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
            <div><label className="text-xs text-gray-500">Ayat Sampai</label><input type="number" value={form.ayatSelesai || ''} onChange={e => setForm({ ...form, ayatSelesai: +e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
            <div><label className="text-xs text-gray-500">Juz</label><input type="number" value={form.juz || ''} onChange={e => setForm({ ...form, juz: +e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Status</label><select value={form.status || 'lancar'} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"><option value="lancar">Lancar</option><option value="kurang_lancar">Kurang Lancar</option><option value="belum_lancar">Belum Lancar</option></select></div>
            <div><label className="text-xs text-gray-500">Nilai (0-100)</label><input type="number" min="0" max="100" value={form.nilai || ''} onChange={e => setForm({ ...form, nilai: +e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
          </div>
          <div><label className="text-xs text-gray-500">Penguji</label><input type="text" value={form.penguji || ''} onChange={e => setForm({ ...form, penguji: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
          <div><label className="text-xs text-gray-500">Catatan</label><textarea value={form.catatan || ''} onChange={e => setForm({ ...form, catatan: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none resize-none" rows={2}/></div>
          <div className="flex gap-2 pt-2"><button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-medium">Simpan</button><button onClick={() => setModal({ open: false, mode: 'add' })} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium">Batal</button></div>
        </div>
      </Modal>
    </div>
  );
}
