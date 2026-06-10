import { Zap, Sparkles, FileText, Target, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuizHistory } from '../../hooks/useQuiz';
import { useMyRanking } from '../../hooks/useRankings';
import { StatCard } from '../molecules/StatCard';
import { XPProgressBar } from '../molecules/XPProgressBar';
import { totalXp, formatRelative, accuracyColor } from '../../lib/utils';
import { Badge } from '../atoms/Badge';
import { Spinner } from '../atoms/Spinner';

export function DashboardStats() {
  const { user } = useAuth();
  const { data: history, isLoading: historyLoading } = useQuizHistory();
  const { data: myRank } = useMyRanking();

  if (!user) return null;

  const completedSessions = history?.filter((h) => h.status === 'COMPLETED') ?? [];
  const totalAnswered = completedSessions.reduce((acc, s) => acc + s.total_questions, 0);
  const totalCorrect  = completedSessions.reduce((acc, s) => acc + s.score, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const accColor = accuracyColor(accuracy) as 'success' | 'warning' | 'error';
  const variantMap = { success: 'success', warning: 'warning', error: 'error' } as const;

  return (
    <div className="flex flex-col gap-6">
      {/* XP Progress */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text">Seu progresso</h2>
            <p className="text-sm text-text-3">
              {totalXp(user.user_level, user.user_experience).toLocaleString('pt-BR')} XP acumulados
            </p>
          </div>
          {myRank && (
            <Badge variant="outline">
              <Trophy size={11} />
              #{myRank.position}
            </Badge>
          )}
        </div>
        <XPProgressBar level={user.user_level} xp={user.user_experience} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Nível atual"
          value={user.user_level}
          icon={<Zap size={16} />}
          description={`${user.user_experience} / 1000 XP`}
        />
        <StatCard
          label="XP total"
          value={totalXp(user.user_level, user.user_experience).toLocaleString('pt-BR')}
          icon={<Sparkles size={16} />}
        />
        <StatCard
          label="Questões"
          value={totalAnswered}
          icon={<FileText size={16} />}
          description="respondidas"
        />
        <StatCard
          label="Precisão"
          value={`${accuracy}%`}
          icon={<Target size={16} />}
          description={accuracy >= 70 ? 'Ótimo!' : 'Continue!'}
        />
      </div>

      {/* Recent history */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-3">
            Últimas partidas
          </h3>
          <Link
            to="/quiz"
            className="flex items-center gap-1 text-xs text-text-2 hover:text-text transition-colors"
          >
            Jogar agora
            <ArrowRight size={12} />
          </Link>
        </div>

        {historyLoading ? (
          <div className="flex justify-center py-6">
            <Spinner size="md" />
          </div>
        ) : completedSessions.length === 0 ? (
          <div className="rounded-lg border border-border bg-bg-secondary p-6 text-center">
            <p className="text-sm text-text-3">Nenhuma partida ainda.</p>
            <Link to="/quiz">
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-text hover:underline">
                Começar primeiro quiz
                <ArrowRight size={13} />
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {completedSessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{session.language.name}</p>
                  <p className="text-xs text-text-3">
                    {session.level?.name ?? 'Todos os níveis'} · {formatRelative(session.started_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={variantMap[accColor]}>{session.accuracy_percentage}%</Badge>
                  <span className="text-xs font-semibold text-success">+{session.total_xp_earned} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
