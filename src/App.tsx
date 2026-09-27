import { useState } from 'react';
import { Page } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import SantriPage from './components/SantriPage';
import HafalanPage from './components/HafalanPage';
import KehadiranPage from './components/KehadiranPage';
import IuranPage from './components/IuranPage';
import LaporanPage from './components/LaporanPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'santri': return <SantriPage />;
      case 'hafalan': return <HafalanPage />;
      case 'kehadiran': return <KehadiranPage />;
      case 'iuran': return <IuranPage />;
      case 'laporan': return <LaporanPage />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page: Page) => { setCurrentPage(page); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => setIsLoggedIn(false)}
      />
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
            </div>
            <h1 className="text-sm font-bold text-emerald-800">Masjid Nurul Iman</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
        </header>

        <main className="p-4 lg:p-6 pb-24 lg:pb-6">
          {renderPage()}
        </main>

        {/* Bottom Navigation - Mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'dashboard' as Page, label: 'Beranda', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
              { id: 'santri' as Page, label: 'Santri', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
              { id: 'hafalan' as Page, label: 'Hafalan', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
              { id: 'kehadiran' as Page, label: 'Absensi', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
              { id: 'iuran' as Page, label: 'Iuran', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentPage === item.id ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;
