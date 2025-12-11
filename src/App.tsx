import { Routes, Route, Navigate } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layouts';
import LoginPage from '@/pages/Login';
import PrivacyPolicyPage from '@/pages/PrivacyPolicy';
import DashboardPage from '@/pages/Dashboard';
import ProfilePage from '@/pages/Profile';
import UsersPage from '@/pages/Users';
import ApplicationsPage from '@/pages/Applications';
import { GoogleCallback } from '@/pages/Auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout
      userName={user?.name}
      userEmail={user?.email}
      userAvatar={user?.avatar_url}
    >
      {children}
    </MainLayout>
  );
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;

