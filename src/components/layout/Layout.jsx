import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Users, Briefcase, Award, Target, Calendar } from 'lucide-react';

export const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Target },
    { path: '/personnel', label: 'Personnel', icon: Users },
    { path: '/skills', label: 'Skills', icon: Award },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/matching', label: 'Matching', icon: Target },
    { path: '/availability', label: 'Availability', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-soft border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">Skills Management</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline inline-flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

