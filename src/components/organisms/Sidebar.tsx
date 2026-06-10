import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { XPProgressBar } from '../molecules/XPProgressBar';
import { Avatar } from '../atoms/Avatar';

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/languages', icon: '📚', label: 'Matérias' },
  { to: '/quiz', icon: '⚔️', label: 'Quiz' },
  { to: '/rankings', icon: '🏆', label: 'Ranking' },
  { to: '/profile', icon: '👤', label: 'Perfil' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();

  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-overlay lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border bg-surface',
          'transition-transform duration-200 ease-in-out',
          'lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <span className="text-xl">⚔️</span>
          <span className="font-bold text-text">DevDungeons</span>
        </div>

        {/* User info */}
        {user && (
          <div className="border-b border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Avatar name={user.username} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">{user.username}</p>
                <p className="text-xs text-text-3">Nível {user.user_level}</p>
              </div>
            </div>
            <XPProgressBar level={user.user_level} xp={user.user_experience} showLabels={false} />
            <p className="mt-1 text-right text-xs text-text-3">{user.user_experience} / 1000 XP</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-accent text-text-inverse font-medium'
                        : 'text-text-2 hover:bg-bg-secondary hover:text-text',
                    )
                  }
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-xs text-text-3 text-center">
            Aprenda. Evolua. Domine.
          </p>
        </div>
      </aside>
    </>
  );
}
