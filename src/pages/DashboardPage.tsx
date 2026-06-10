import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardStats } from '../components/organisms/DashboardStats';
import { Button } from '../components/atoms/Button';
import { levelLabel } from '../lib/utils';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Olá, {user?.username?.split(' ')[0]}
          </h1>
          <p className="text-sm text-text-3 mt-0.5">
            {levelLabel(user?.user_level ?? 0)} · Continue evoluindo!
          </p>
        </div>
        <Link to="/quiz">
          <Button size="md">
            <Zap size={15} />
            Jogar agora
          </Button>
        </Link>
      </div>

      <DashboardStats />

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/languages"
          className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 hover:border-border-2 hover:shadow-sm transition-all"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-bg-tertiary text-text-2 group-hover:bg-accent group-hover:text-text-inverse transition-colors">
            <BookOpen size={20} />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-text group-hover:text-accent transition-colors">Explorar desafios</p>
            <p className="text-xs text-text-3">JavaScript, Python, HTML e mais</p>
          </div>
          <ChevronRight size={16} className="text-text-3 group-hover:text-text-2" />
        </Link>
        <Link
          to="/rankings"
          className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 hover:border-border-2 hover:shadow-sm transition-all"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-bg-tertiary text-text-2 group-hover:bg-accent group-hover:text-text-inverse transition-colors">
            <Trophy size={20} />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-text group-hover:text-accent transition-colors">Ranking global</p>
            <p className="text-xs text-text-3">Veja sua posição entre todos</p>
          </div>
          <ChevronRight size={16} className="text-text-3 group-hover:text-text-2" />
        </Link>
      </div>
    </div>
  );
}
