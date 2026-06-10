import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Alternative } from '../../types/api';

interface QuestionAlternativeProps {
  alternative: Alternative;
  index: number;
  selected: boolean;
  disabled?: boolean;
  result?: 'correct' | 'wrong' | 'correct-answer';
  onSelect: (id: string) => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function QuestionAlternative({
  alternative,
  index,
  selected,
  disabled,
  result,
  onSelect,
}: QuestionAlternativeProps) {
  const isCorrect = result === 'correct' || result === 'correct-answer';
  const isWrong = result === 'wrong';
  const isCorrectAnswer = result === 'correct-answer';

  const showCheck = (isCorrect && selected) || isCorrectAnswer;
  const showWrong = isWrong && selected;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(alternative.id)}
      className={cn(
        'group flex w-full items-start gap-3 rounded-lg border p-4 text-left',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        !disabled && !result && 'hover:border-border-2 hover:bg-bg-secondary cursor-pointer',
        disabled && 'cursor-default',
        !result && !selected && 'bg-surface border-border',
        !result && selected && 'bg-accent-subtle border-accent',
        isWrong && selected && 'bg-error-bg border-error',
        isCorrect && selected && 'bg-success-bg border-success',
        isCorrectAnswer && !selected && 'bg-success-bg border-success',
      )}
    >
      {/* Letter badge */}
      <span
        className={cn(
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold',
          !result && !selected && 'bg-bg-tertiary text-text-2',
          !result && selected && 'bg-accent text-text-inverse',
          isWrong && selected && 'bg-error text-white',
          isCorrect && selected && 'bg-success text-white',
          isCorrectAnswer && !selected && 'bg-success text-white',
        )}
      >
        {LETTERS[index]}
      </span>

      {/* Text */}
      <span
        className={cn(
          'flex-1 text-sm leading-relaxed pt-0.5',
          !result && 'text-text',
          isWrong && selected && 'text-error',
          (isCorrect && selected) && 'text-success',
          isCorrectAnswer && !selected && 'text-success',
        )}
      >
        {alternative.descricao}
      </span>

      {/* Result icon */}
      {result && (
        <span className="flex-shrink-0 mt-0.5">
          {showCheck && <Check size={16} strokeWidth={3} className="text-success" />}
          {showWrong && <X size={16} strokeWidth={3} className="text-error" />}
        </span>
      )}
    </button>
  );
}
