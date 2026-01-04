import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import useThemeStore from '../../store/useThemeStore';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { initialize } = useAuthStore();
  const { theme } = useThemeStore();


  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Header />

      <div className="flex">
        <Sidebar />

        <main
          className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 lg:ml-64"
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

