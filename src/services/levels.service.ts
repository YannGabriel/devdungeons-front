import { api } from '../lib/api';
import type { KnowledgeLevel } from '../types/api';

export const levelsService = {
  getAll: () =>
    api.get<KnowledgeLevel[]>('/knowledge-levels').then((r) => r.data),

  getById: (id: string) =>
    api.get<KnowledgeLevel>(`/knowledge-levels/${id}`).then((r) => r.data),
};
