import { api } from '../lib/api';
import type { ProgrammingLanguage } from '../types/api';

export const languagesService = {
  getAll: () =>
    api.get<ProgrammingLanguage[]>('/programming-languages').then((r) => r.data),

  getById: (id: string) =>
    api.get<ProgrammingLanguage>(`/programming-languages/${id}`).then((r) => r.data),
};
