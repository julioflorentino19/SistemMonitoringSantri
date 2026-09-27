import { useState, useEffect } from 'react';
import { db, auth, initDatabase, getSantriName, getUsia } from './store';
import { Page, User, Santri, HafalanRecord, KehadiranRecord, IuranRecord } from './types';

// Initialize database on first load
initDatabase();

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slide-up ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
      {type === 'success' ? '✓' : '✗'} {message}
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = auth.login(username, password);
      if (user) { onLogin(user); }
      else { setError('Username atau password salah!'); setLoading(false); }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Masjid Nurul Iman</h1>
          <p className="text-emerald-100 text-sm mt-1">Sistem Informasi Data Santri</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Masuk ke Sistem</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="admin" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="••••••••" required />
            </div>
            {error && <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {loading ? <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Memproses...</> : 'Masuk'}
            </button>
          </form>
          <div className="mt-4 p-3 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-700 font-medium mb-1">🔑 Akun Demo:</p>
            <p className="text-xs text-blue-600">admin / admin123</p>
            <p className="text-xs text-blue-600">ustadz / ustadz123</p>
            <p className="text-xs text-blue-600">pengurus / pengurus123</p>
          </div>
        </div>
        <p className="text-center text-emerald-200 text-xs mt-6">© 2024 Masjid Nurul Iman • Metode Waterfall</p>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ page, setPage, user, onLogout, open, onClose }: { page: Page; setPage: (p: Page) => void; user: User; onLogout: () => void; open: boolean; onClose: () => void }) {
  const items: { id: Page; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'santri', label: 'Data Santri', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'hafalan', label: 'Hafalan', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'kehadiran', label: 'Kehadiran', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'iuran', label: 'Iuran', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'laporan', label: 'Laporan', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose}/>}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
            </div>
            <div><h2 className="font-bold text-gray-800 text-sm">Masjid Nurul Iman</h2><p className="text-xs text-gray-500">Sistem Informasi Santri</p></div>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {items.map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); onClose(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${page === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <svg className={`w-5 h-5 ${page === item.id ? 'text-emerald-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/></svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center"><span className="text-emerald-700 font-bold text-sm">{user.namaLengkap.charAt(0)}</span></div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 truncate">{user.namaLengkap}</p><p className="text-xs text-gray-500 capitalize">{user.role}</p></div>
            <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg></button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================================
// MODAL COMPONENT
// ============================================================
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ setPage }: { setPage: (p: Page) => void }) {
  const santri = db.getSantri();
  const hafalan = db.getHafalan();
  const kehadiran = db.getKehadiran();
  const iuran = db.getIuran();
  const latestDate = [...new Set(kehadiran.map(k => k.tanggal))].sort().reverse()[0] || '';
  const todayHadir = kehadiran.filter(k => k.tanggal === latestDate && k.status === 'hadir').length;
  const lunas = iuran.filter(i => i.status === 'lunas').length;
  const terkumpul = iuran.filter(i => i.status === 'lunas').reduce((s, i) => s + i.jumlahBayar, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-xl font-bold mb-1">Assalamu'alaikum 👋</h1>
        <p className="text-emerald-100 text-sm">Selamat datang di Sistem Informasi Data Santri</p>
        <p className="text-emerald-200 text-xs mt-1">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Santri', value: santri.length, color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', page: 'santri' as Page },
          { label: 'Hadir Hari Ini', value: todayHadir, color: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', page: 'kehadiran' as Page },
          { label: 'Total Hafalan', value: hafalan.length, color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', page: 'hafalan' as Page },
          { label: 'Iuran Terkumpul', value: `Rp ${(terkumpul/1000).toFixed(0)}K`, color: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', page: 'iuran' as Page },
        ].map((s, i) => (
          <button key={i} onClick={() => setPage(s.page)} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100">
            <div className={`${s.light} w-10 h-10 rounded-lg flex items-center justify-center ${s.text} mb-3`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <p className="text-xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">📖 Status Hafalan</h3>
          {[{ l: 'Lancar', c: hafalan.filter(h => h.status === 'lancar').length, col: 'bg-emerald-500' }, { l: 'Kurang', c: hafalan.filter(h => h.status === 'kurang_lancar').length, col: 'bg-amber-500' }, { l: 'Belum', c: hafalan.filter(h => h.status === 'belum_lancar').length, col: 'bg-red-500' }].map((x, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 ${x.col} rounded-full`}></div>
              <span className="text-sm text-gray-600 flex-1">{x.l}</span>
              <span className="text-sm font-semibold">{x.c}</span>
              <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${x.col} rounded-full`} style={{ width: `${(x.c / hafalan.length) * 100}%` }}></div></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">💰 Iuran</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-emerald-50 rounded-xl"><p className="text-xl font-bold text-emerald-600">{lunas}</p><p className="text-xs text-gray-500">Lunas</p></div>
            <div className="text-center p-3 bg-amber-50 rounded-xl"><p className="text-xl font-bold text-amber-600">{iuran.filter(i => i.status === 'sebagian').length}</p><p className="text-xs text-gray-500">Sebagian</p></div>
            <div className="text-center p-3 bg-red-50 rounded-xl"><p className="text-xl font-bold text-red-600">{iuran.filter(i => i.status === 'belum_bayar').length}</p><p className="text-xs text-gray-500">Belum</p></div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between"><span className="text-sm text-gray-500">Terkumpul</span><span className="text-sm font-bold text-emerald-600">Rp {terkumpul.toLocaleString('id-ID')}</span></div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SANTRI PAGE - Full CRUD
// ============================================================
function SantriPage() {
  const [data, setData] = useState(db.getSantri());
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'view'; item?: Santri }>({ open: false, mode: 'view' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
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
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
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

      {/* Modal Add/Edit */}
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

      {/* Modal View */}
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

// ============================================================
// HAFALAN PAGE - Full CRUD
// ============================================================
function HafalanPage() {
  const [data, setData] = useState(db.getHafalan());
  const santriList = db.getSantri();
  const [filterSantri, setFilterSantri] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; item?: HafalanRecord }>({ open: false, mode: 'add' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState<Partial<HafalanRecord>>({});

  const refresh = () => setData(db.getHafalan());
  const filtered = data.filter(h => (!filterSantri || h.santriId === filterSantri) && (!filterStatus || h.status === filterStatus));

  const openAdd = () => { setForm({ tanggal: new Date().toISOString().split('T')[0], status: 'lancar', nilai: 80, penguji: 'Ustadz Ali' }); setModal({ open: true, mode: 'add' }); };
  const openEdit = (h: HafalanRecord) => { setForm(h); setModal({ open: true, mode: 'edit', item: h }); };

  const handleSave = () => {
    if (!form.santriId || !form.surat || !form.tanggal) { setToast({ msg: 'Lengkapi data!', type: 'error' }); return; }
    if (modal.mode === 'add') {
      db.addHafalan({ santriId: form.santriId!, tanggal: form.tanggal!, surat: form.surat!, nomorSurat: form.nomorSurat || 0, ayatMulai: form.ayatMulai || 1, ayatSelesai: form.ayatSelesai || 10, juz: form.juz || 1, halaman: form.halaman || 1, status: (form.status || 'lancar') as any, nilai: form.nilai || 80, catatan: form.catatan || '', penguji: form.penguji || '' });
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
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
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

// ============================================================
// KEHADIRAN PAGE - Full CRUD
// ============================================================
function KehadiranPage() {
  const [data, setData] = useState(db.getKehadiran());
  const santriList = db.getSantri();
  const dates = [...new Set(data.map(k => k.tanggal))].sort().reverse();
  const [selDate, setSelDate] = useState(dates[0] || '');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; item?: KehadiranRecord }>({ open: false, mode: 'add' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState<Partial<KehadiranRecord>>({});

  const refresh = () => setData(db.getKehadiran());
  const dayData = data.filter(k => k.tanggal === selDate);
  const hadir = dayData.filter(k => k.status === 'hadir').length;

  const openAdd = () => { setForm({ tanggal: selDate || new Date().toISOString().split('T')[0], status: 'hadir' }); setModal({ open: true, mode: 'add' }); };
  const openEdit = (k: KehadiranRecord) => { setForm(k); setModal({ open: true, mode: 'edit', item: k }); };

  const handleSave = () => {
    if (!form.santriId || !form.tanggal) { setToast({ msg: 'Lengkapi data!', type: 'error' }); return; }
    if (modal.mode === 'add') {
      db.addKehadiran({ santriId: form.santriId!, tanggal: form.tanggal!, status: (form.status || 'hadir') as any, keterangan: form.keterangan || '', jamMasuk: form.status === 'hadir' ? (form.jamMasuk || new Date().toTimeString().slice(0, 5)) : null, jamKeluar: form.status === 'hadir' ? (form.jamKeluar || '17:00') : null } as any);
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
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
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
                {k.jamMasuk && <p className="text-xs text-gray-400">🕐 {k.jamMasuk} - {k.jamKeluar}</p>}
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

// ============================================================
// IURAN PAGE - Full CRUD
// ============================================================
function IuranPage() {
  const [data, setData] = useState(db.getIuran());
  const santriList = db.getSantri();
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'bayar'; item?: IuranRecord }>({ open: false, mode: 'add' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState<Partial<IuranRecord>>({});

  const refresh = () => setData(db.getIuran());
  const filtered = data.filter(i => !filterStatus || i.status === filterStatus);
  const lunas = data.filter(i => i.status === 'lunas').length;
  const terkumpul = data.filter(i => i.status === 'lunas').reduce((s, i) => s + i.jumlahBayar, 0);
  const totalTagihan = data.reduce((s, i) => s + i.jumlahTagihan, 0);

  const openAdd = () => { setForm({ bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 0, status: 'belum_bayar', metodeBayar: 'tunai', tanggalBayar: new Date().toISOString().split('T')[0] }); setModal({ open: true, mode: 'add' }); };
  const openEdit = (i: IuranRecord) => { setForm(i); setModal({ open: true, mode: 'edit', item: i }); };
  const openBayar = (i: IuranRecord) => { setForm({ ...i, jumlahBayar: i.jumlahTagihan - i.jumlahBayar, tanggalBayar: new Date().toISOString().split('T')[0] }); setModal({ open: true, mode: 'bayar', item: i }); };

  const handleSave = () => {
    if (!form.santriId) { setToast({ msg: 'Pilih santri!', type: 'error' }); return; }
    if (modal.mode === 'add') {
      const bayar = form.jumlahBayar || 0;
      const tagihan = form.jumlahTagihan || 50000;
      const status = bayar >= tagihan ? 'lunas' : bayar > 0 ? 'sebagian' : 'belum_bayar';
      db.addIuran({ santriId: form.santriId!, bulan: form.bulan || 'Januari', tahun: form.tahun || 2024, jumlahTagihan: tagihan, jumlahBayar: bayar, status: status as any, tanggalBayar: bayar > 0 ? (form.tanggalBayar || null) : null, metodeBayar: (form.metodeBayar || 'tunai') as any, keterangan: form.keterangan || '' } as any);
      setToast({ msg: 'Iuran dicatat!', type: 'success' });
    } else if (modal.mode === 'edit') {
      db.updateIuran(modal.item!.id, form);
      setToast({ msg: 'Iuran diupdate!', type: 'success' });
    } else {
      // Bayar
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
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
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

// ============================================================
// LAPORAN PAGE
// ============================================================
function LaporanPage() {
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

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [user, setUser] = useState<User | null>(auth.getSession());
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <LoginPage onLogin={setUser}/>;

  const handleLogout = () => { auth.logout(); setUser(null); };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard setPage={setPage}/>;
      case 'santri': return <SantriPage/>;
      case 'hafalan': return <HafalanPage/>;
      case 'kehadiran': return <KehadiranPage/>;
      case 'iuran': return <IuranPage/>;
      case 'laporan': return <LaporanPage/>;
      default: return <Dashboard setPage={setPage}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
      <div className="flex-1 lg:ml-64">
        <header className="lg:hidden bg-white shadow-sm sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100"><svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg></button>
          <div className="flex items-center gap-2"><div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg></div><h1 className="text-sm font-bold text-emerald-800">Masjid Nurul Iman</h1></div>
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center"><span className="text-white text-xs font-bold">{user.namaLengkap.charAt(0)}</span></div>
        </header>
        <main className="p-4 lg:p-6 pb-24 lg:pb-6">{renderPage()}</main>
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
          <div className="flex items-center justify-around py-2">
            {([
              { id: 'dashboard' as Page, l: 'Beranda', i: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { id: 'santri' as Page, l: 'Santri', i: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
              { id: 'hafalan' as Page, l: 'Hafalan', i: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { id: 'kehadiran' as Page, l: 'Absensi', i: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { id: 'iuran' as Page, l: 'Iuran', i: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            ]).map(item => (
              <button key={item.id} onClick={() => setPage(item.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg ${page === item.id ? 'text-emerald-600' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.i}/></svg>
                <span className="text-[10px] font-medium">{item.l}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;
