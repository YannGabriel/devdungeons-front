import { Medal } from 'lucide-react';
import { cn, levelLabel } from '../../lib/utils';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import type { RankingEntry } from '../../types/api';

interface RankItemProps {
  entry: RankingEntry;
  isMe?: boolean;
}

const MEDAL_COLORS: Record<number, string> = {
  1: 'text-yellow-500',
  2: 'text-slate-400',
  3: 'text-amber-600',
};

function PositionBadge({ position }: { position: number }) {
  if (position <= 3) {
    return (
      <Medal
        size={22}
        className={cn('flex-shrink-0', MEDAL_COLORS[position])}
        aria-label={`${position}º lugar`}
      />
    );
  }
  return (
    <span className="w-8 text-center text-sm font-medium tabular-nums text-text-3">
      #{position}
    </span>
  );
}

export function RankItem({ entry, isMe }: RankItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors',
        isMe
          ? 'bg-accent-subtle border-accent'
          : 'bg-surface border-border hover:bg-bg-secondary',
      )}
    >
      <PositionBadge position={entry.position} />

      <Avatar name={entry.username} size="sm" />

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className={cn('text-sm font-semibold truncate', isMe ? 'text-accent' : 'text-text')}>
          {entry.username}
          {isMe && <span className="ml-1.5 text-xs font-normal text-text-3">(você)</span>}
        </span>
        <span className="text-xs text-text-3">{levelLabel(entry.user_level)}</span>
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-bold text-text tabular-nums">
          {entry.total_xp.toLocaleString('pt-BR')} XP
        </span>
        <Badge variant="outline" size="sm">Nível {entry.user_level}</Badge>
      </div>
    </div>
  );
}
