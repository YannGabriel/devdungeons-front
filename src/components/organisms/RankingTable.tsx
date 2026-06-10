import { useState } from 'react';
import { useRankings, useMyRanking } from '../../hooks/useRankings';
import { useAuth } from '../../contexts/AuthContext';
import { RankItem } from '../molecules/RankItem';
import { Spinner } from '../atoms/Spinner';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

const LIMIT_OPTIONS = [10, 50, 100] as const;

export function RankingTable() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<typeof LIMIT_OPTIONS[number]>(10);

  const { data, isLoading, isFetching } = useRankings(page, limit);
  const { data: myRank } = useMyRanking();

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {LIMIT_OPTIONS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => { setLimit(l); setPage(1); }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                limit === l
                  ? 'bg-accent text-text-inverse'
                  : 'bg-bg-secondary text-text-2 hover:bg-bg-tertiary'
              }`}
            >
              Top {l}
            </button>
          ))}
        </div>

        {myRank && (
          <Badge variant="outline">
            Sua posição: #{myRank.position} de {myRank.total}
          </Badge>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col gap-2 relative">
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/60 rounded-lg">
              <Spinner size="md" />
            </div>
          )}
          {data?.data.map((entry) => (
            <RankItem
              key={entry.id}
              entry={entry}
              isMe={entry.id === user?.id}
            />
          ))}
          {data?.data.length === 0 && (
            <p className="text-center py-8 text-text-3">Nenhum resultado encontrado.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            ← Anterior
          </Button>
          <span className="text-sm text-text-3">
            Página {page} de {data.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.totalPages}
          >
            Próxima →
          </Button>
        </div>
      )}
    </div>
  );
}
