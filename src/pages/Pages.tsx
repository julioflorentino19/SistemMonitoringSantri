import { useState } from 'react';
import { db, getSantriName, Kehadiran, Iuran } from '../db';

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

export function KehadiranPage({ setToast }: { setToast: (t: { msg: string; type: 'success' | 'error' } | null) => void }) {
  const [data, setData] = useState(db.getKehadiran());
  const santriList = db.getSantri();
  const dates = [...new Set(data.map(k => k.tanggal))].sort().reverse();
  const [selDate, setSelDate] = useState(dates[0] || '');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; item?: Kehadiran }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Partial<Kehadiran>>({});

  const refresh = () => setData(db.getKehadiran());
  const dayData = data.filter(k => k.tanggal === selDate);

  const openAdd = () => { setForm({ tanggal: selDate || new Date().toISOString().split('T')[0], status: 'hadir' }); setModal({ open: true, mode: 'add' }); };
  const openEdit = (k: Kehadiran) => { setForm(k); setModal({ open: true, mode: 'edit', item: k }); };

  const handleSave = () => {
    if (!form.santriId || !form.tanggal) { setToast({ msg: 'Lengkapi data!', type: 'error' }); return; }
    if (modal.mode === 'add') {
      db.addKehadiran({ santriId: form.santriId!, tanggal: form.tanggal!, status: (form.status || 'hadir') as any, keterangan: form.keterangan || '' });
      setToast({ msg: 'Kehadiran dicatat!', type: 'success' });
    } else {
      db.updateKehadiran(modal.item!.id, form);
      setToast({ msg: 'Kehadiran diupdate!', type: 'success' });
    }
    refresh(); setModal({ open: false, mode: 'add' });
  };

  const handleDelete = (id: string) => { if (confirm('Hapus data?')) { db.deleteKehadiran(id); refresh(); setToast({ msg: 'Data dihapus!', type: 'success' }); } };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-800">📋 Kehadiran</h1><p className="text-sm text-gray-500">Absensi harian santri</p></div>
        <button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg><span className="hidden sm:inline">Absen</span></button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100"><p className="text-lg font-bold text-emerald-700">{dayData.filter(k => k.status === 'hadir').length}</p><p className="text-[10px] text-emerald-600">Hadir</p></div>
        <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100"><p className="text-lg font-bold text-blue-700">{dayData.filter(k => k.status === 'izin').length}</p><p className="text-[10px] text-blue-600">Izin</p></div>
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100"><p className="text-lg font-bold text-amber-700">{dayData.filter(k => k.status === 'sakit').length}</p><p className="text-[10px] text-amber-600">Sakit</p></div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100"><p className="text-lg font-bold text-red-700">{dayData.filter(k => k.status === 'alpha').length}</p><p className="text-[10px] text-red-600">Alpha</p></div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <label className="text-xs text-gray-500 mb-1 block">Pilih Tanggal</label>
        <select value={selDate} onChange={e => setSelDate(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none">
          {dates.map(d => <option key={d} value={d}>{new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {dayData.map(k => (
          <div key={k.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${k.status === 'hadir' ? 'bg-emerald-100' : k.status === 'izin' ? 'bg-blue-100' : k.status === 'sakit' ? 'bg-amber-100' : 'bg-red-100'}`}>
                {k.status === 'hadir' ? '✓' : k.status === 'izin' ? '📋' : k.status === 'sakit' ? '🤒' : '✗'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><h4 className="font-medium text-gray-800 text-sm">{getSantriName(k.santriId)}</h4><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${k.status === 'hadir' ? 'bg-emerald-100 text-emerald-700' : k.status === 'izin' ? 'bg-blue-100 text-blue-700' : k.status === 'sakit' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{k.status}</span></div>
                {k.keterangan && <p className="text-xs text-gray-500">{k.keterangan}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(k)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                <button onClick={() => handleDelete(k.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </div>
            </div>
          </div>
        ))}
        {dayData.length === 0 && <div className="text-center py-12 text-gray-500">Belum ada data kehadiran</div>}
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: 'add' })} title={modal.mode === 'add' ? '➕ Input Kehadiran' : '✏️ Edit Kehadiran'}>
        <div className="space-y-3">
          <div><label className="text-xs text-gray-500">Santri *</label><select value={form.santriId || ''} onChange={e => setForm({ ...form, santriId: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"><option value="">Pilih Santri</option>{santriList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Tanggal</label><input type="date" value={form.tanggal || ''} onChange={e => setForm({ ...form, tanggal: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
            <div><label className="text-xs text-gray-500">Status</label><select value={form.status || 'hadir'} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"><option value="hadir">Hadir</option><option value="izin">Izin</option><option value="sakit">Sakit</option><option value="alpha">Alpha</option></select></div>
          </div>
          <div><label className="text-xs text-gray-500">Keterangan</label><input type="text" value={form.keterangan || ''} onChange={e => setForm({ ...form, keterangan: e.target.value })} placeholder="Opsional" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
          <div className="flex gap-2 pt-2"><button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-medium">Simpan</button><button onClick={() => setModal({ open: false, mode: 'add' })} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium">Batal</button></div>
        </div>
      </Modal>
    </div>
  );
}

export function IuranPage({ setToast }: { setToast: (t: { msg: string; type: 'success' | 'error' } | null) => void }) {
  const [data, setData] = useState(db.getIuran());
  const santriList = db.getSantri();
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'bayar'; item?: Iuran }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Partial<Iuran>>({});

  const refresh = () => setData(db.getIuran());
  const filtered = data.filter(i => !filterStatus || i.status === filterStatus);
  const lunas = data.filter(i => i.status === 'lunas').length;
  const terkumpul = data.filter(i => i.status === 'lunas').reduce((s, i) => s + i.jumlahBayar, 0);
  const totalTagihan = data.reduce((s, i) => s + i.jumlahTagihan, 0);

  const openAdd = () => { setForm({ bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 0, status: 'belum_bayar', metodeBayar: 'tunai', tanggalBayar: new Date().toISOString().split('T')[0] }); setModal({ open: true, mode: 'add' }); };
  const openEdit = (i: Iuran) => { setForm(i); setModal({ open: true, mode: 'edit', item: i }); };
  const openBayar = (i: Iuran) => { setForm({ ...i, jumlahBayar: i.jumlahTagihan - i.jumlahBayar, tanggalBayar: new Date().toISOString().split('T')[0] }); setModal({ open: true, mode: 'bayar', item: i }); };

  const handleSave = () => {
    if (!form.santriId) { setToast({ msg: 'Pilih santri!', type: 'error' }); return; }
    if (modal.mode === 'add') {
      const bayar = form.jumlahBayar || 0;
      const tagihan = form.jumlahTagihan || 50000;
      const status = bayar >= tagihan ? 'lunas' : bayar > 0 ? 'sebagian' : 'belum_bayar';
      db.addIuran({ santriId: form.santriId!, bulan: form.bulan || 'Januari', tahun: form.tahun || 2024, jumlahTagihan: tagihan, jumlahBayar: bayar, status: status as any, tanggalBayar: bayar > 0 ? (form.tanggalBayar || null) : null, metodeBayar: (form.metodeBayar || 'tunai') as any, keterangan: form.keterangan || '' });
      setToast({ msg: 'Iuran dicatat!', type: 'success' });
    } else if (modal.mode === 'edit') {
      db.updateIuran(modal.item!.id, form);
      setToast({ msg: 'Iuran diupdate!', type: 'success' });
    } else {
      const newBayar = (modal.item!.jumlahBayar) + (form.jumlahBayar || 0);
      const tagihan = modal.item!.jumlahTagihan;
      const status = newBayar >= tagihan ? 'lunas' : 'sebagian';
      db.updateIuran(modal.item!.id, { jumlahBayar: newBayar, status: status as any, tanggalBayar: form.tanggalBayar || new Date().toISOString().split('T')[0], metodeBayar: (form.metodeBayar || 'tunai') as any });
      setToast({ msg: 'Pembayaran tercatat!', type: 'success' });
    }
    refresh(); setModal({ open: false, mode: 'add' });
  };

  const handleDelete = (id: string) => { if (confirm('Hapus data?')) { db.deleteIuran(id); refresh(); setToast({ msg: 'Data dihapus!', type: 'success' }); } };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-800">💰 Iuran Bulanan</h1><p className="text-sm text-gray-500">Kelola pembayaran iuran</p></div>
        <button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg><span className="hidden sm:inline">Catat</span></button>
      </div>
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <p className="text-emerald-100 text-xs">Total Terkumpul</p>
        <p className="text-2xl font-bold">Rp {terkumpul.toLocaleString('id-ID')}</p>
        <div className="w-full h-2 bg-white/20 rounded-full mt-3"><div className="h-full bg-white rounded-full" style={{ width: `${(terkumpul / totalTagihan) * 100}%` }}></div></div>
        <div className="flex justify-between mt-2 text-xs text-emerald-100"><span>{Math.round((terkumpul / totalTagihan) * 100)}% tercapai</span><span>Sisa: Rp {(totalTagihan - terkumpul).toLocaleString('id-ID')}</span></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100"><p className="text-xl font-bold text-emerald-700">{lunas}</p><p className="text-xs text-emerald-600">Lunas</p></div>
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100"><p className="text-xl font-bold text-amber-700">{data.filter(i => i.status === 'sebagian').length}</p><p className="text-xs text-amber-600">Sebagian</p></div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100"><p className="text-xl font-bold text-red-700">{data.filter(i => i.status === 'belum_bayar').length}</p><p className="text-xs text-red-600">Belum</p></div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none"><option value="">Semua Status</option><option value="lunas">Lunas</option><option value="sebagian">Sebagian</option><option value="belum_bayar">Belum Bayar</option></select>
      </div>
      <div className="space-y-2">
        {filtered.map(i => (
          <div key={i.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${i.status === 'lunas' ? 'bg-emerald-500' : i.status === 'sebagian' ? 'bg-amber-500' : 'bg-red-500'}`}>{getSantriName(i.santriId).charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap"><h4 className="font-semibold text-gray-800 text-sm">{getSantriName(i.santriId)}</h4><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i.status === 'lunas' ? 'bg-emerald-100 text-emerald-700' : i.status === 'sebagian' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{i.status === 'lunas' ? '✓ Lunas' : i.status === 'sebagian' ? '~ Sebagian' : '✗ Belum'}</span></div>
                  <p className="text-xs text-gray-600 mt-1">📅 {i.bulan} {i.tahun} • Rp {i.jumlahBayar.toLocaleString('id-ID')} / {i.jumlahTagihan.toLocaleString('id-ID')}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${i.metodeBayar === 'tunai' ? 'bg-green-50 text-green-600' : i.metodeBayar === 'transfer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{i.metodeBayar === 'tunai' ? '💵 Tunai' : i.metodeBayar === 'transfer' ? '🏦 Transfer' : '📱 QRIS'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {i.status !== 'lunas' && <button onClick={() => openBayar(i)} className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600" title="Bayar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></button>}
                <button onClick={() => openEdit(i)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Edit"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                <button onClick={() => handleDelete(i.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Hapus"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, mode: 'add' })} title={modal.mode === 'add' ? '➕ Catat Iuran' : modal.mode === 'edit' ? '✏️ Edit Iuran' : '💵 Bayar Iuran'}>
        <div className="space-y-3">
          {modal.mode !== 'bayar' && (
            <div><label className="text-xs text-gray-500">Santri *</label><select value={form.santriId || ''} onChange={e => setForm({ ...form, santriId: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"><option value="">Pilih Santri</option>{santriList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}</select></div>
          )}
          {modal.mode === 'bayar' && <div className="bg-emerald-50 p-3 rounded-lg"><p className="text-sm font-medium text-emerald-800">{getSantriName(modal.item!.santriId)}</p><p className="text-xs text-emerald-600">Tagihan: Rp {modal.item!.jumlahTagihan.toLocaleString('id-ID')} • Sudah bayar: Rp {modal.item!.jumlahBayar.toLocaleString('id-ID')}</p></div>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Bulan</label><select value={form.bulan || 'Januari'} onChange={e => setForm({ ...form, bulan: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">{['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map(m => <option key={m}>{m}</option>)}</select></div>
            <div><label className="text-xs text-gray-500">Tahun</label><input type="number" value={form.tahun || 2024} onChange={e => setForm({ ...form, tahun: +e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Tagihan</label><input type="number" value={form.jumlahTagihan || 50000} onChange={e => setForm({ ...form, jumlahTagihan: +e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
            <div><label className="text-xs text-gray-500">{modal.mode === 'bayar' ? 'Jumlah Bayar' : 'Sudah Bayar'}</label><input type="number" value={form.jumlahBayar || 0} onChange={e => setForm({ ...form, jumlahBayar: +e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
          </div>
          <div><label className="text-xs text-gray-500">Metode Bayar</label><select value={form.metodeBayar || 'tunai'} onChange={e => setForm({ ...form, metodeBayar: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"><option value="tunai">Tunai</option><option value="transfer">Transfer</option><option value="qris">QRIS</option></select></div>
          <div><label className="text-xs text-gray-500">Keterangan</label><input type="text" value={form.keterangan || ''} onChange={e => setForm({ ...form, keterangan: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"/></div>
          <div className="flex gap-2 pt-2"><button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-medium">Simpan</button><button onClick={() => setModal({ open: false, mode: 'add' })} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium">Batal</button></div>
        </div>
      </Modal>
    </div>
  );
}

export function LaporanPage() {
  const santri = db.getSantri();
  const hafalan = db.getHafalan();
  const kehadiran = db.getKehadiran();
  const iuran = db.getIuran();
  const [tab, setTab] = useState<'kehadiran' | 'hafalan' | 'iuran'>('kehadiran');

  return (
    <div className="space-y-4 animate-fade-in">
      <div><h1 className="text-xl font-bold text-gray-800">📊 Laporan</h1><p className="text-sm text-gray-500">Ringkasan & analisis data</p></div>
      <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 flex gap-1">
        {(['kehadiran', 'hafalan', 'iuran'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{t === 'kehadiran' ? '📋 Kehadiran' : t === 'hafalan' ? '📖 Hafalan' : '💰 Iuran'}</button>
        ))}
      </div>

      {tab === 'kehadiran' && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Rekap Kehadiran per Santri</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-xs text-gray-500">Santri</th><th className="text-center py-2 text-xs text-gray-500">Hadir</th><th className="text-center py-2 text-xs text-gray-500">Total</th><th className="text-center py-2 text-xs text-gray-500">%</th></tr></thead>
              <tbody>
                {santri.map(s => {
                  const records = kehadiran.filter(k => k.santriId === s.id);
                  const h = records.filter(k => k.status === 'hadir').length;
                  const pct = records.length > 0 ? Math.round((h / records.length) * 100) : 0;
                  return (
                    <tr key={s.id} className="border-b border-gray-50">
                      <td className="py-2.5"><div className="flex items-center gap-2"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.jenisKelamin === 'L' ? 'bg-blue-500' : 'bg-pink-500'}`}>{s.nama.charAt(0)}</div><span className="text-xs text-gray-700">{s.nama}</span></div></td>
                      <td className="py-2.5 text-center text-emerald-600 font-medium text-xs">{h}</td>
                      <td className="py-2.5 text-center text-gray-600 text-xs">{records.length}</td>
                      <td className="py-2.5 text-center"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pct >= 80 ? 'bg-emerald-100 text-emerald-700' : pct >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{pct}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'hafalan' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"><p className="text-2xl font-bold text-gray-800">{hafalan.length}</p><p className="text-xs text-gray-500">Total</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"><p className="text-2xl font-bold text-emerald-600">{hafalan.filter(h => h.status === 'lancar').length}</p><p className="text-xs text-gray-500">Lancar</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"><p className="text-2xl font-bold text-purple-600">{Math.round(hafalan.reduce((s, h) => s + h.nilai, 0) / (hafalan.length || 1))}</p><p className="text-xs text-gray-500">Rata² Nilai</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"><p className="text-2xl font-bold text-blue-600">{[...new Set(hafalan.map(h => h.surat))].length}</p><p className="text-xs text-gray-500">Surat</p></div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Progress per Santri</h3>
            <div className="space-y-3">
              {santri.map(s => {
                const records = hafalan.filter(h => h.santriId === s.id);
                const max = Math.max(...santri.map(ss => hafalan.filter(h => h.santriId === ss.id).length));
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.jenisKelamin === 'L' ? 'bg-blue-500' : 'bg-pink-500'}`}>{s.nama.charAt(0)}</div>
                    <div className="flex-1"><div className="flex justify-between mb-1"><span className="text-sm text-gray-700 truncate">{s.nama}</span><span className="text-xs text-gray-500">{records.length} hafalan</span></div><div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${(records.length / max) * 100}%` }}></div></div></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'iuran' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Ringkasan Keuangan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4"><p className="text-xs text-emerald-600">Terkumpul</p><p className="text-lg font-bold text-emerald-700">Rp {iuran.filter(i => i.status === 'lunas').reduce((s, i) => s + i.jumlahBayar, 0).toLocaleString('id-ID')}</p></div>
              <div className="bg-red-50 rounded-xl p-4"><p className="text-xs text-red-600">Sisa</p><p className="text-lg font-bold text-red-700">Rp {(iuran.reduce((s, i) => s + i.jumlahTagihan, 0) - iuran.reduce((s, i) => s + i.jumlahBayar, 0)).toLocaleString('id-ID')}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Detail per Santri</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-xs text-gray-500">Santri</th><th className="text-right py-2 text-xs text-gray-500">Tagihan</th><th className="text-right py-2 text-xs text-gray-500">Bayar</th><th className="text-center py-2 text-xs text-gray-500">Status</th></tr></thead>
                <tbody>
                  {iuran.map(i => (
                    <tr key={i.id} className="border-b border-gray-50">
                      <td className="py-2.5 text-xs text-gray-700">{getSantriName(i.santriId)}</td>
                      <td className="py-2.5 text-right text-xs text-gray-600">Rp {i.jumlahTagihan.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 text-right text-xs font-medium">Rp {i.jumlahBayar.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 text-center"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${i.status === 'lunas' ? 'bg-emerald-100 text-emerald-700' : i.status === 'sebagian' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{i.status === 'lunas' ? 'Lunas' : i.status === 'sebagian' ? 'Sebagian' : 'Belum'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
