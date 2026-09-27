import { useState, useEffect } from 'react';
import { db, auth, initDB, resetDB, getSantriName, getUsia, User, Santri, Hafalan, Kehadiran, Iuran, Page } from './db';
import SantriPage from './pages/SantriPage';
import HafalanPage from './pages/HafalanPage';
import { KehadiranPage, IuranPage, LaporanPage } from './pages/Pages';

// Initialize database
initDB();

// Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slide-up ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
      {type === 'success' ? '✓' : '✗'} {message}
    </div>
  );
};

// Modal Component
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

// Login Page
const LoginPage = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = auth.login(username, password);
      if (user) onLogin(user);
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
};

// Sidebar
const Sidebar = ({ page, setPage, user, onLogout, open, onClose }: { page: Page; setPage: (p: Page) => void; user: User; onLogout: () => void; open: boolean; onClose: () => void }) => {
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
};

// Dashboard
const Dashboard = ({ setPage }: { setPage: (p: Page) => void }) => {
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
};

// Main App
function App() {
  const [user, setUser] = useState<User | null>(auth.getSession());
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  if (!user) return <LoginPage onLogin={setUser}/>;

  const handleLogout = () => { auth.logout(); setUser(null); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
      <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
      <div className="flex-1 lg:ml-64">
        <header className="lg:hidden bg-white shadow-sm sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100"><svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg></button>
          <div className="flex items-center gap-2"><div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg></div><h1 className="text-sm font-bold text-emerald-800">Masjid Nurul Iman</h1></div>
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center"><span className="text-white text-xs font-bold">{user.namaLengkap.charAt(0)}</span></div>
        </header>
        <main className="p-4 lg:p-6 pb-24 lg:pb-6">
          {page === 'dashboard' && <Dashboard setPage={setPage}/>}
          {page === 'santri' && <SantriPage setToast={setToast}/>}
          {page === 'hafalan' && <HafalanPage setToast={setToast}/>}
          {page === 'kehadiran' && <KehadiranPage setToast={setToast}/>}
          {page === 'iuran' && <IuranPage setToast={setToast}/>}
          {page === 'laporan' && <LaporanPage/>}
        </main>
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
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
