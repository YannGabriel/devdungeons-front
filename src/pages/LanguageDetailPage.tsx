import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Target, CheckCircle, AlertCircle, XCircle, Zap } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguages';
import { useLevels } from '../hooks/useLevels';
import { useQuizHistory } from '../hooks/useQuiz';
import { useQuizStore } from '../store/quiz.store';
import { Spinner } from '../components/atoms/Spinner';
import { Badge } from '../components/atoms/Badge';
import { formatRelative, accuracyColor } from '../lib/utils';

const LEVEL_COLORS: Record<string, 'success' | 'warning' | 'error'> = {
  'Básico':        'success',
  'Intermediário': 'warning',
  'Avançado':      'error',
};

const LEVEL_ICONS: Record<string, typeof CheckCircle> = {
  'Básico':        CheckCircle,
  'Intermediário': AlertCircle,
  'Avançado':      XCircle,
};

export function LanguageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: language, isLoading, isError } = useLanguage(id ?? '');
  const { data: levels } = useLevels();
  const { data: history } = useQuizHistory();
  const { setLanguageId, setLevelId, reset } = useQuizStore();

  const langHistory = history?.filter((h) => h.language.name === language?.name) ?? [];

  const handleStartQuiz = (levelId?: string) => {
    reset();
    setLanguageId(id ?? '');
    if (levelId) setLevelId(levelId);
    navigate('/quiz');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !language) {
    return (
      <div className="rounded-lg border border-error/20 bg-error-bg p-6 text-center">
        <p className="text-sm text-error">Desafio não encontrado.</p>
        <Link to="/languages" className="mt-2 inline-flex items-center gap-1 text-sm text-text hover:underline">
          <ArrowLeft size={13} /> Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          to="/languages"
          className="flex items-center gap-1 text-text-3 hover:text-text transition-colors"
        >
          <ArrowLeft size={14} />
          Desafios
        </Link>
        <span className="text-border-2">/</span>
        <h1 className="font-bold text-text">{language.name}</h1>
      </div>

      {/* Start quiz cards per level */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-1 text-base font-semibold text-text">Iniciar quiz</h2>
        <p className="mb-4 text-sm text-text-3">Escolha o nível de dificuldade</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* All levels */}
          <button
            type="button"
            onClick={() => handleStartQuiz()}
            className="group flex items-center gap-3 rounded-lg border border-border bg-bg-secondary p-4 text-left hover:border-border-2 hover:shadow-sm transition-all"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-tertiary text-text-3 group-hover:bg-accent group-hover:text-text-inverse transition-colors">
              <Target size={18} />
            </span>
            <div>
              <p className="font-semibold text-text group-hover:text-accent transition-colors">Todos os níveis</p>
              <p className="text-xs text-text-3">Mix aleatório de questões</p>
            </div>
          </button>

          {/* Per level */}
          {levels?.map((level) => {
            const color = LEVEL_COLORS[level.name] ?? 'default';
            const LevelIcon = LEVEL_ICONS[level.name] ?? Zap;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => handleStartQuiz(level.id)}
                className="group flex items-center gap-3 rounded-lg border border-border bg-bg-secondary p-4 text-left hover:border-border-2 hover:shadow-sm transition-all"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-tertiary group-hover:bg-accent group-hover:text-text-inverse transition-colors">
                  <LevelIcon
                    size={18}
                    className={`text-${color} group-hover:text-text-inverse transition-colors`}
                  />
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-text group-hover:text-accent transition-colors">{level.name}</p>
                  <p className="text-xs text-text-3">+{level.xp} XP por acerto</p>
                </div>
                <Badge variant={color} size="sm">
                  {level.xp} XP
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* History for this language */}
      {langHistory.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-3">
            Histórico neste desafio
          </h3>
          <div className="flex flex-col gap-2">
            {langHistory.slice(0, 8).map((session) => {
              const accColor = accuracyColor(session.accuracy_percentage);
              const variantMap = { success: 'success', warning: 'warning', error: 'error' } as const;
              return (
                <div
                  key={session.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">
                      {session.level?.name ?? 'Todos os níveis'}
                    </p>
                    <p className="text-xs text-text-3">{formatRelative(session.started_at)}</p>
                  </div>
                  <p className="text-xs text-text-3 tabular-nums">
                    {session.score}/{session.total_questions}
                  </p>
                  <Badge variant={variantMap[accColor]}>{session.accuracy_percentage}%</Badge>
                  <span className="text-xs font-semibold text-success">+{session.total_xp_earned} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
