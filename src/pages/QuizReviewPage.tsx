import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Trophy, Target, FileText, Zap } from 'lucide-react';
import { useQuizSession } from '../hooks/useQuiz';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Spinner } from '../components/atoms/Spinner';
import { Progress } from '../components/atoms/Progress';
import { cn, accuracyColor } from '../lib/utils';
import type { QuizQuestionItem } from '../types/api';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function ReviewAlternative({
  alt,
  index,
  isYourAnswer,
  isCorrect,
}: {
  alt: { id: string; descricao: string };
  index: number;
  isYourAnswer: boolean;
  isCorrect: boolean;
}) {
  const isCorrectAnswer = isCorrect;
  const isWrongAnswer = isYourAnswer && !isCorrect;
  const isHighlighted = isYourAnswer || isCorrectAnswer;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3',
        isWrongAnswer && 'bg-error-bg border-error/20',
        isCorrectAnswer && 'bg-success-bg border-success/20',
        !isHighlighted && 'bg-surface border-border',
      )}
    >
      <span
        className={cn(
          'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold',
          isWrongAnswer && 'bg-error text-white',
          isCorrectAnswer && 'bg-success text-white',
          !isHighlighted && 'bg-bg-tertiary text-text-2',
        )}
      >
        {LETTERS[index]}
      </span>
      <span
        className={cn(
          'flex-1 text-sm leading-relaxed pt-0.5',
          isWrongAnswer && 'text-error',
          isCorrectAnswer && 'text-success',
          !isHighlighted && 'text-text-3',
        )}
      >
        {alt.descricao}
      </span>
      {isYourAnswer && (
        <span className="flex-shrink-0 mt-0.5">
          {isCorrect
            ? <Check size={14} strokeWidth={3} className="text-success" />
            : <X size={14} strokeWidth={3} className="text-error" />}
        </span>
      )}
      {!isYourAnswer && isCorrectAnswer && (
        <Check size={14} strokeWidth={3} className="text-success flex-shrink-0 mt-0.5" />
      )}
    </div>
  );
}

function ReviewQuestion({ q, index }: { q: QuizQuestionItem; index: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Question header */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 border-b border-border',
          q.correct ? 'bg-success-bg' : 'bg-error-bg',
        )}
      >
        <span
          className={cn(
            'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full',
            q.correct ? 'bg-success text-white' : 'bg-error text-white',
          )}
        >
          {q.correct
            ? <Check size={12} strokeWidth={3} />
            : <X size={12} strokeWidth={3} />}
        </span>
        <span className="text-xs font-semibold text-text-2">Questão {index + 1}</span>
        {q.xp_earned > 0 && (
          <span className="ml-auto text-xs font-bold text-success">+{q.xp_earned} XP</span>
        )}
      </div>

      {/* Question text */}
      <div className="px-4 py-4">
        <p className="text-sm font-medium text-text leading-relaxed">{q.enunciado}</p>
      </div>

      {/* Alternatives */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {q.alternatives.map((alt, idx) => {
          const isYourAnswer = q.your_answer === alt.id;
          const isCorrectAlt = q.correct_alternative_id === alt.id;
          return (
            <ReviewAlternative
              key={alt.id}
              alt={alt}
              index={idx}
              isYourAnswer={isYourAnswer}
              isCorrect={isCorrectAlt}
            />
          );
        })}
      </div>
    </div>
  );
}

export function QuizReviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useQuizSession(sessionId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-text-3">Sessão não encontrada.</p>
        <Button variant="secondary" onClick={() => navigate('/quiz')}>Voltar</Button>
      </div>
    );
  }

  const correct = session.progress.current_score;
  const total = session.progress.questions_total;
  const accuracy = session.progress.accuracy_percentage;
  const xp = session.progress.total_xp_earned;
  const color = accuracyColor(accuracy);
  const badgeVariant = { success: 'success', warning: 'warning', error: 'error' } as const;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="w-fit -ml-1"
        onClick={() => navigate('/quiz')}
      >
        <ArrowLeft size={15} />
        Voltar ao Quiz
      </Button>

      {/* Summary card */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-text">{session.language.name}</h1>
            <p className="text-sm text-text-3">{session.level?.name ?? 'Todos os níveis'} · Revisão</p>
          </div>
          <Badge variant={badgeVariant[color]}>{accuracy}% de acertos</Badge>
        </div>

        <div className="mt-4">
          <Progress value={accuracy} size="sm" label="Precisão" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { Icon: Check, label: 'Acertos', value: correct, cls: 'text-success' },
            { Icon: X,     label: 'Erros',   value: total - correct, cls: 'text-error' },
            { Icon: Target, label: 'Precisão', value: `${accuracy}%`, cls: 'text-text' },
            { Icon: Zap,   label: 'XP ganho', value: `+${xp}`, cls: 'text-warning' },
          ].map(({ Icon, label, value, cls }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg bg-bg-secondary px-3 py-2.5">
              <Icon size={14} className={cn('flex-shrink-0', cls)} />
              <div>
                <p className="text-xs text-text-3">{label}</p>
                <p className={cn('text-sm font-bold', cls)}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText size={15} className="text-text-3" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-3">
            Questões ({total})
          </h2>
          <Trophy size={13} className="text-warning ml-auto" />
          <span className="text-xs text-text-3">{correct} corretas</span>
        </div>

        <div className="flex flex-col gap-3">
          {session.questions.map((q, idx) => (
            <ReviewQuestion key={q.order} q={q} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
