import { useQuery } from '@tanstack/react-query';
import { languagesService } from '../services/languages.service';

export const languageKeys = {
  all: ['languages'] as const,
  detail: (id: string) => ['languages', id] as const,
};

export function useLanguages() {
  return useQuery({
    queryKey: languageKeys.all,
    queryFn: languagesService.getAll,
  });
}

export function useLanguage(id: string) {
  return useQuery({
    queryKey: languageKeys.detail(id),
    queryFn: () => languagesService.getById(id),
    enabled: !!id,
  });
}
