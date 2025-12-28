import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import useThemeStore from '../../store/useThemeStore';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { initialize } = useAuthStore();
  const { theme } = useThemeStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    initialize();
  }, [initialize]);

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
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Header />

      <div className="flex">
        <Sidebar />

        <main
          className={`flex-1 p-6 lg:p-8 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'
            }`}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

