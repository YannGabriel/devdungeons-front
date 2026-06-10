import { Trophy } from 'lucide-react';
import { RankingTable } from '../components/organisms/RankingTable';

export function RankingsPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Trophy size={22} className="text-red-500 flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-text">Ranking Global</h1>
          <p className="mt-0.5 text-sm text-text-3">
            Os melhores programadores da plataforma
          </p>
        </div>
      </div>

      <RankingTable />
    </div>
  );
}
