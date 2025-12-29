import { Clock, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';

const PendingApproval = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-10 w-10 text-yellow-600 dark:text-yellow-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              Account Pending Approval
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Your registration has been received successfully
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-1">
                  Account Email
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="border-t border-yellow-200 dark:border-yellow-800 pt-4">
              <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                Your account is currently awaiting approval from an administrator. 
                You will be able to access the system once your account has been approved.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-slate-400">
              <p className="mb-1">What happens next?</p>
              <ul className="text-left space-y-2 mt-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 dark:text-primary-400 mt-0.5">•</span>
                  <span>An administrator will review your registration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 dark:text-primary-400 mt-0.5">•</span>
                  <span>You will receive notification once approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 dark:text-primary-400 mt-0.5">•</span>
                  <span>You can then log in and access the system</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
                icon={LogOut}
              >
                Back to Login
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-slate-500">
              If you have any questions, please contact your system administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;

