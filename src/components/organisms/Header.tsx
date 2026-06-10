import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import {
  LayoutDashboard,
  Zap,
  Trophy,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { XPProgressBar } from '../molecules/XPProgressBar';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/quiz', label: 'Quiz', Icon: Zap },
  { to: '/rankings', label: 'Ranking', Icon: Trophy },
] as const;

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#010101] backdrop-blur-sm">
      <div className="flex h-14 items-center gap-2 px-4 sm:px-6">

        {/* Brand */}
        <Link to="/dashboard" className="mr-4 flex-shrink-0">
          <img src="/devdungeons-header.svg" alt="DevDungeons" className="h-7" />
        </Link>

        {/* Horizontal nav — desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* XP bar — desktop only */}
          <div
            className="hidden lg:flex flex-col w-36"
            style={{ '--color-xp-track': 'rgba(255,255,255,0.15)', '--color-accent': 'rgba(255,255,255,0.8)' } as React.CSSProperties}
          >
            <XPProgressBar level={user.user_level} xp={user.user_experience} showLabels={false} />
            <p className="mt-0.5 text-right text-xs text-white/50">
              Nv. {user.user_level} · {user.user_experience} XP
            </p>
          </div>

          {/* User dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              className="flex items-center gap-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <img src="/profile-icon.svg" alt={user.username} className="h-8 w-8 rounded-full" />
              <ChevronDown size={14} className="text-white/50 hidden sm:block" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-border bg-surface shadow-lg animate-fade-in">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold text-text truncate">{user.username}</p>
                    <p className="text-xs text-text-3 truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/rankings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-text hover:bg-bg-secondary transition-colors"
                    >
                      <Trophy size={14} />
                      Ranking
                    </Link>
                  </div>
                  <div className="border-t border-border p-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-error hover:bg-error-bg transition-colors"
                    >
                      <LogOut size={14} />
                      Sair
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Menu"
            className="flex items-center justify-center rounded-md p-1.5 text-white/60 hover:bg-white/10 md:hidden"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <nav className="border-t border-white/10 bg-[#010101] px-4 py-2 md:hidden animate-fade-in">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors my-0.5',
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
