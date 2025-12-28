import { Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import ThemeToggle from '../common/ThemeToggle';

const Header = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Sync with sidebar collapse state
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setSidebarCollapsed(true);
      } else if (currentScrollY < lastScrollY) {
        setSidebarCollapsed(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 sticky top-0 z-40 shadow-lg backdrop-blur-sm transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link to="/dashboard" className="flex items-center group">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-primary-600 font-bold text-lg">SM</span>
            </div>
            <span className="ml-3 text-xl font-bold text-white hidden sm:block group-hover:text-white/90 transition-colors">
              Skills Management
            </span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search - Desktop only */}
          <div className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-white/15 transition-all duration-200 group">
            <Search className="h-4 w-4 text-white/60 group-hover:text-white/80 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white placeholder-white/50 text-sm ml-2 w-32 focus:w-48 transition-all duration-300"
            />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;

