import { useQuery } from '@tanstack/react-query';
import { rankingsService } from '../services/rankings.service';

export const rankingKeys = {
  list: (page: number, limit: number) => ['rankings', page, limit] as const,
  me: ['rankings', 'me'] as const,
};

export function useRankings(page = 1, limit = 10) {
  return useQuery({
    queryKey: rankingKeys.list(page, limit),
    queryFn: () => rankingsService.getAll(page, limit),
    staleTime: 1000 * 30,
  });
}

export function useMyRanking() {
  return useQuery({
    queryKey: rankingKeys.me,
    queryFn: rankingsService.getMe,
    staleTime: 1000 * 30,
  });
}
