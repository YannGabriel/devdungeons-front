import { useQuery } from '@tanstack/react-query';
import { levelsService } from '../services/levels.service';
import { levelNameOrder } from '../lib/utils';

export const levelKeys = {
  all: ['levels'] as const,
};

export function useLevels() {
  return useQuery({
    queryKey: levelKeys.all,
    queryFn: levelsService.getAll,
    select: (data) =>
      [...data].sort((a, b) => (levelNameOrder[a.name] ?? 99) - (levelNameOrder[b.name] ?? 99)),
    staleTime: 1000 * 60 * 10,
  });
}
