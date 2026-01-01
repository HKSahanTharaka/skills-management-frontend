import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import ThemeToggle from '../common/ThemeToggle';
import SearchModal from '../common/SearchModal';

const Header = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 sticky top-0 z-40 shadow-lg backdrop-blur-sm transition-all duration-300 lg:ml-64">
      <div className="flex items-center justify-between h-16 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={toggleSidebar}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 lg:hidden flex-shrink-0"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link to="/dashboard" className="flex items-center group min-w-0">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 overflow-hidden flex-shrink-0">
              <img
                src="/assets/logo.png"
                alt="Skills Management Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <span className="ml-2 sm:ml-3 text-base sm:text-xl font-bold text-white hidden xs:block sm:block group-hover:text-white/90 transition-colors truncate">
              <span className="hidden sm:inline">Skills Management</span>
              <span className="sm:hidden">Skills Mgmt</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setShowSearch(true)}
            className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-white/15 transition-all duration-200 group cursor-pointer"
          >
            <Search className="h-4 w-4 text-white/60 group-hover:text-white/80 transition-colors" />
            <span className="bg-transparent border-none outline-none text-white/50 text-sm ml-2 group-hover:text-white/70 transition-colors">
              Search...
            </span>
            <kbd className="hidden xl:inline-flex ml-2 px-2 py-0.5 text-xs text-white/50 bg-white/10 rounded">
              Ctrl+K
            </kbd>
          </button>

          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Search className="h-5 w-5" />
          </button>

          <ThemeToggle />
        </div>
      </div>

      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </header>
  );
};

export default Header;

