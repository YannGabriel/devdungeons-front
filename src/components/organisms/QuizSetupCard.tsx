import { useState } from 'react';
import { Play, Code2, Check, Eye, RefreshCw } from 'lucide-react';
import { getLangConfig } from '../../lib/langConfig';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import type { ProgrammingLanguage, KnowledgeLevel } from '../../types/api';

export interface CompletedSession {
  sessionId: string;
  accuracy: number;
}

interface QuizSetupCardProps {
  language: ProgrammingLanguage;
  levels: KnowledgeLevel[];
  /** levelId → completed session info */
  completedSessions: Record<string, CompletedSession>;
  isStarting: boolean;
  disabled: boolean;
  onStart: (languageId: string, levelId: string) => void;
  onReview: (sessionId: string) => void;
}

const LEVEL_STYLE: Record<string, { bar: string; xpColor: string; dot: string }> = {
  'Básico': { bar: 'bg-success', xpColor: 'text-success', dot: 'bg-success' },
  'Intermediário': { bar: 'bg-warning', xpColor: 'text-warning', dot: 'bg-warning' },
  'Avançado': { bar: 'bg-error', xpColor: 'text-error', dot: 'bg-error' },
};

const XP_LABEL: Record<string, string> = {
  'Básico': '+50 XP',
  'Intermediário': '+75 XP',
  'Avançado': '+100 XP',
};

export function QuizSetupCard({
  language,
  levels,
  completedSessions,
  isStarting,
  disabled,
  onStart,
  onReview,
}: QuizSetupCardProps) {
  const [levelId, setLevelId] = useState<string>(() => levels[0]?.id ?? '');
  const config = getLangConfig(language.name);
  const selectedCompleted = levelId ? completedSessions[levelId] : null;

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border bg-surface transition-all duration-200',
        isStarting
          ? 'border-accent shadow-lg ring-1 ring-accent/30'
          : 'border-border hover:border-border-2 hover:shadow-sm',
      )}
    >
      {/* Icon + name */}
      <div className="flex flex-col items-center gap-3 px-5 py-6">
        {config ? (
          <config.Icon size={56} style={{ color: config.color }} aria-label={language.name} />
        ) : (
          <Code2 size={56} className="text-text-3" aria-label={language.name} />
        )}
        <h3 className="font-bold text-sm text-text text-center leading-tight">
          {language.name}
        </h3>
      </div>

      {/* Level rows */}
      <div className="border-t border-border flex flex-col">
        {levels.map((lvl, idx) => {
          const isSelected = levelId === lvl.id;
          const style = LEVEL_STYLE[lvl.name];
          const isLast = idx === levels.length - 1;
          const completed = completedSessions[lvl.id];

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setLevelId(lvl.id)}
              className={cn(
                'relative flex items-center justify-between px-4 py-2.5 text-left transition-colors',
                !isLast && 'border-b border-border',
                isSelected ? 'bg-bg-secondary' : 'hover:bg-bg-secondary/60',
              )}
            >
              {/* Colored side bar */}
              {isSelected && (
                <span className={cn('absolute left-0 top-0 h-full w-[3px]', style?.bar ?? 'bg-accent')} />
              )}

              <div className="flex items-center gap-2.5 pl-1.5">
                {/* Radio dot */}
                <span className={cn(
                  'flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  isSelected
                    ? cn('border-transparent', style?.dot ?? 'bg-accent')
                    : 'border-border-2 bg-transparent',
                )}>
                  {isSelected && <Check size={9} strokeWidth={3.5} className="text-white" />}
                </span>

                <span className={cn(
                  'text-xs font-semibold transition-colors',
                  isSelected ? 'text-text' : 'text-text-3',
                )}>
                  {lvl.name}
                </span>

                {/* Concluído badge */}
                {completed && (
                  <span className="flex items-center gap-0.5 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                    <Check size={8} strokeWidth={3} />
                    {completed.accuracy}%
                  </span>
                )}
              </div>

              <span className={cn(
                'text-xs font-bold tabular-nums transition-colors',
                isSelected ? (style?.xpColor ?? 'text-accent') : 'text-text-3',
              )}>
                {XP_LABEL[lvl.name] ?? `+${lvl.xp} XP`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="p-3 flex flex-col gap-1.5">
        {selectedCompleted ? (
          <>
            <Button
              fullWidth
              size="sm"
              className='border-t border-t-black'
              variant="secondary"
              onClick={() => onReview(selectedCompleted.sessionId)}
            >
              <p className='flex gap-3 items-center'>
                <Eye size={13} />
                Revisitar
              </p>

            </Button>
          </>
        ) : (
          <Button
            fullWidth
            size="sm"
            disabled={(disabled && !isStarting) || !levelId}
            loading={isStarting}
            onClick={() => onStart(language.id, levelId)}
          >
            <p className='flex gap-3 items-center'>
              {!isStarting && <Play size={13} />}
              Acessar
            </p>

          </Button>
        )}
      </div>
    </div>
  );
}
