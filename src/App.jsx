import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const { initialize, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/personnel"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Personnel Management</h1>
                    <p className="mt-2 text-gray-600">Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
                    <p className="mt-2 text-gray-600">Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
                    <p className="mt-2 text-gray-600">Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/matching"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Personnel Matching</h1>
                    <p className="mt-2 text-gray-600">Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/availability"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Availability & Allocations</h1>
                    <p className="mt-2 text-gray-600">Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#374151',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

