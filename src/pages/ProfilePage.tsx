import { Zap, Sparkles, FileText, Target, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQuizHistory } from '../hooks/useQuiz';
import { useMyRanking } from '../hooks/useRankings';
import { Avatar } from '../components/atoms/Avatar';
import { Badge } from '../components/atoms/Badge';
import { StatCard } from '../components/molecules/StatCard';
import { XPProgressBar } from '../components/molecules/XPProgressBar';
import { Spinner } from '../components/atoms/Spinner';
import { totalXp, levelLabel, formatRelative, accuracyColor } from '../lib/utils';

export function ProfilePage() {
  const { user } = useAuth();
  const { data: history, isLoading } = useQuizHistory();
  const { data: myRank } = useMyRanking();

  if (!user) return null;

  const completedSessions = history?.filter((h) => h.status === 'COMPLETED') ?? [];
  const totalAnswered = completedSessions.reduce((acc, s) => acc + s.total_questions, 0);
  const totalCorrect  = completedSessions.reduce((acc, s) => acc + s.score, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const variantMap = { success: 'success', warning: 'warning', error: 'error' } as const;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Profile card */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-start gap-4">
          <Avatar name={user.username} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-text">{user.username}</h1>
              <Badge variant="outline">{levelLabel(user.user_level)}</Badge>
              {myRank && (
                <Badge variant="default">
                  <Trophy size={11} />
                  #{myRank.position} global
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-sm text-text-3">{user.email}</p>
            <p className="mt-0.5 text-xs text-text-3">
              {totalXp(user.user_level, user.user_experience).toLocaleString('pt-BR')} XP acumulados
            </p>
          </div>
        </div>

        <div className="mt-5">
          <XPProgressBar level={user.user_level} xp={user.user_experience} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Nível"
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
        />
      </div>

      {/* Languages */}
      {user.languages && user.languages.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-3">
            Desafios selecionados
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.languages.map((ul) => (
              <div key={ul.id} className="flex items-center gap-1.5 rounded-md bg-bg-secondary px-3 py-1.5">
                <span className="text-sm font-medium text-text">{ul.language.name}</span>
                <Badge variant="outline" size="sm">{ul.level.name}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz history */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-3">
          Histórico de partidas
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : completedSessions.length === 0 ? (
          <div className="rounded-lg border border-border bg-bg-secondary p-8 text-center">
            <p className="text-sm text-text-3">Nenhuma partida concluída ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {completedSessions.map((session) => {
              const sColor = accuracyColor(session.accuracy_percentage) as 'success' | 'warning' | 'error';
              return (
                <div
                  key={session.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">{session.language.name}</p>
                    <p className="text-xs text-text-3">
                      {session.level?.name ?? 'Todos os níveis'} · {formatRelative(session.started_at)}
                    </p>
                  </div>
                  <p className="text-xs text-text-3 tabular-nums hidden sm:block">
                    {session.score}/{session.total_questions}
                  </p>
                  <Badge variant={variantMap[sColor]}>{session.accuracy_percentage}%</Badge>
                  <span className="text-xs font-semibold text-success">+{session.total_xp_earned} XP</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
