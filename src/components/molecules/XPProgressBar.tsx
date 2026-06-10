import { levelProgress, levelLabel, xpToNextLevel } from '../../lib/utils';
import { Progress } from '../atoms/Progress';
import { cn } from '../../lib/utils';

interface XPProgressBarProps {
  level: number;
  xp: number;
  className?: string;
  showLabels?: boolean;
}

export function XPProgressBar({ level, xp, className, showLabels = true }: XPProgressBarProps) {
  const progress = levelProgress(xp);
  const nextXp = xpToNextLevel();

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text">
            Nível {level} — {levelLabel(level)}
          </span>
          <span className="text-text-3">
            {xp} / {nextXp} XP
          </span>
        </div>
      )}
      <Progress value={progress} size="sm" label={`${progress}% para nível ${level + 1}`} />
      {showLabels && (
        <p className="text-right text-xs text-text-3">{progress}%</p>
      )}
    </div>
  );
}
