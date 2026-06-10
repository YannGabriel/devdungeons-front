import { Link } from 'react-router-dom';
import { Check, X, RefreshCw, BookOpen } from 'lucide-react';
import { cn, accuracyColor } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import type { QuizFinalResults, QuizSession } from '../../types/api';

interface QuizResultsProps {
  results: QuizFinalResults;
  session: QuizSession;
  onRetry: () => void;
}

export function QuizResults({ results, session, onRetry }: QuizResultsProps) {
  const color = accuracyColor(results.accuracy_percentage);
  const variantMap = { success: 'success', warning: 'warning', error: 'error' } as const;

  const colorClass = {
    success: 'text-success',
    warning: 'text-warning',
    error:   'text-error',
  }[color];

  const total = results.questions_summary.length;

  return (
    <div className="flex flex-col gap-6 animate-bounce-in">
      {/* Hero result */}
      <div className="rounded-2xl border border-white/10 bg-[#010101] px-8 py-8 text-center">
        <img
          src="/finish-dragon.svg"
          alt="Dragão comemorando"
          className="h-28 mx-auto mb-4 drop-shadow-lg"
        />
        <h2 className="text-2xl font-bold text-white">Parabéns!</h2>
        <p className="mt-2 text-base text-white/70 leading-snug">
          Você acaba de completar uma atividade com{' '}
          <span className="text-red-500 font-bold">
            {results.correct_answers}/{total} acertos
          </span>
          !
        </p>
        <p className="mt-1 text-xs text-white/40">
          {session.language.name}
          {session.level && ` · ${session.level.name}`}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-white">{results.correct_answers}</span>
            <span className="text-xs text-white/40">Acertos</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className={cn('text-2xl font-black', colorClass)}>
              {results.accuracy_percentage}%
            </span>
            <span className="text-xs text-white/40">Precisão</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-white">+{results.total_xp_earned}</span>
            <span className="text-xs text-white/40">XP ganho</span>
          </div>
        </div>

        <Badge variant={variantMap[color]} className="mt-4">
          {results.accuracy_percentage}% de aproveitamento
        </Badge>
      </div>

      {/* Questions summary */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wider">
          Resumo das questões
        </h3>
        {results.questions_summary.map((q) => (
          <div
            key={q.order}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-3',
              q.correct ? 'border-success/20 bg-success-bg' : 'border-error/20 bg-error-bg',
            )}
          >
            <span className={cn(
              'flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full mt-0.5',
              q.correct ? 'bg-success/20 text-success' : 'bg-error/20 text-error',
            )}>
              {q.correct
                ? <Check size={11} strokeWidth={3} />
                : <X size={11} strokeWidth={3} />
              }
            </span>
            <p className="flex-1 text-sm text-text leading-snug line-clamp-2">{q.enunciado}</p>
            {q.xp_earned > 0 && (
              <span className="text-xs font-semibold text-success whitespace-nowrap">
                +{q.xp_earned} XP
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" fullWidth onClick={onRetry}>
          <RefreshCw size={15} />
          Tentar novamente
        </Button>
        <Link to="/languages" className="flex-1">
          <Button variant="primary" fullWidth>
            <BookOpen size={15} />
            Explorar desafios
          </Button>
        </Link>
      </div>
    </div>
  );
}
