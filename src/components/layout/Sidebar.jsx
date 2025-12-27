import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Users, Award, Briefcase, Target, Calendar } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  const menuItems = [
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

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <Icon
                  className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400'}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Need Help?</h4>
            <p className="text-xs text-gray-600 mb-3">
              Check our documentation or contact support
            </p>
            <button className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
              View Docs →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

