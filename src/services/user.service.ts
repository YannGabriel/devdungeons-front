import { api } from '../lib/api';
import type { AuthUser } from '../types/api';

export const userService = {
  getMe: () =>
    api.get<AuthUser>('/auth/me').then((r) => r.data),

  getById: (id: string) =>
    api.get<AuthUser>(`/user/${id}`).then((r) => r.data),

  updateProfile: (id: string, data: { username?: string; email?: string; password?: string }) =>
    api.patch<AuthUser>(`/user/${id}`, data).then((r) => r.data),
};
