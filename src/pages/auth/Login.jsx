import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { loginSchema } from '../../utils/validation';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { token, user } = await authService.login(data);
      login(token, user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="light">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-4">
              <img
                src="/assets/logo.png"
                alt="Skills Management Logo"
                className="h-20 w-20 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your Skills Management account
            </p>
          </div>

          {/* Form */}
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                className="!bg-white !text-gray-900 !border-gray-300"
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                className="!bg-white !text-gray-900 !border-gray-300"
                {...register('password')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

