import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/theme.store';
import { ProtectedRoute } from './router/ProtectedRoute';
import { AuthLayout } from './components/templates/AuthLayout';
import { AppLayout } from './components/templates/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { LanguagesPage } from './pages/LanguagesPage';
import { LanguageDetailPage } from './pages/LanguageDetailPage';
import { QuizPage } from './pages/QuizPage';
import { RankingsPage } from './pages/RankingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const { theme, applyTheme } = useThemeStore();

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected app routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/languages" element={<LanguagesPage />} />
            <Route path="/languages/:id" element={<LanguageDetailPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz/:sessionId" element={<QuizPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
