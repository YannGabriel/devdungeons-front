import { Outlet, Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../molecules/ThemeToggle';
import { Spinner } from '../atoms/Spinner';

export function AuthLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Topbar */}
      <div className="flex h-14 items-center justify-between px-6 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-accent" />
          <span className="font-bold text-text">DevDungeons</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-text-3 border-t border-border">
        DevDungeons — Aprenda. Evolua. Domine.
      </div>
    </div>
  );
}
