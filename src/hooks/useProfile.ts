import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { useAuth } from '../contexts/AuthContext';

export const userKeys = {
  me: ['user', 'me'] as const,
  detail: (id: string) => ['user', id] as const,
};

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: userKeys.me,
    queryFn: userService.getMe,
    enabled: !!user,
    initialData: user ?? undefined,
    staleTime: 1000 * 60 * 2,
  });
}
