import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Users, Award, Briefcase, Target, Calendar, User, Settings, LogOut, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import RoleBadge from '../common/RoleBadge';

const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const baseMenuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/personnel',
      label: 'Personnel',
      icon: Users,
    },
    {
      path: '/skills',
      label: 'Skills',
      icon: Award,
    },
    {
      path: '/projects',
      label: 'Projects',
      icon: Briefcase,
    },
    {
      path: '/matching',
      label: 'Matching',
      icon: Target,
    },
    {
      path: '/availability',
      label: 'Availability',
      icon: Calendar,
    },
  ];

  const adminMenuItems = [
    {
      path: '/managers',
      label: 'Managers',
      icon: UserCheck,
      adminOnly: true,
    },
  ];

  const menuItems = user?.role === 'admin' 
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64
          bg-gradient-to-b from-gray-50 via-white to-gray-50
          dark:from-slate-800 dark:via-slate-900 dark:to-slate-800
          border-r border-gray-200 dark:border-slate-700
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col shadow-xl
        `}
        >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 lg:hidden bg-white dark:bg-slate-900">
          <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">Menu</span>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider px-4 mb-2">
              Main Menu
            </p>
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-200 group relative
                  ${active
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-400 font-medium shadow-sm border-l-4 border-primary-600 dark:border-primary-500'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 border-l-4 border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <div
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${active
                      ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="flex-1">{item.label}</span>
                {active && (
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 border-l-4 border-transparent hover:border-gray-300 dark:hover:border-slate-600"
            >
              <div className="p-2 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{user?.email}</p>
                <RoleBadge role={user?.role} />
              </div>

            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 py-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-all duration-200 group"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="p-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <span>Profile</span>
                  </Link>
                  <hr className="my-2 border-gray-100 dark:border-slate-700" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all duration-200 group"
                  >
                    <div className="p-1.5 bg-danger-50 dark:bg-danger-900/20 rounded-lg group-hover:bg-danger-100 dark:group-hover:bg-danger-900/30 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

