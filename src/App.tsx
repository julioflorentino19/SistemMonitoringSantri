import { useState } from 'react';
import { Page } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import SantriPage from './components/SantriPage';
import HafalanPage from './components/HafalanPage';
import KehadiranPage from './components/KehadiranPage';
import IuranPage from './components/IuranPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'santri':
        return <SantriPage />;
      case 'hafalan':
        return <HafalanPage />;
      case 'kehadiran':
        return <KehadiranPage />;
      case 'iuran':
        return <IuranPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page: Page) => {
          setCurrentPage(page);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => setIsLoggedIn(false)}
      />
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm font-semibold text-emerald-800">Masjid Nurul Iman</h1>
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
        </header>
        {/* Main Content */}
        <main className="p-4 lg:p-6 pb-20 lg:pb-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
