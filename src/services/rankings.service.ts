import { api } from '../lib/api';
import type { RankingResponse } from '../types/api';

export interface MyRankingResponse {
  position: number;
  total: number;
}

export const rankingsService = {
  getAll: (page = 1, limit = 10) =>
    api
      .get<RankingResponse>('/rankings', { params: { page, limit } })
      .then((r) => r.data),

  getMe: () =>
    api.get<MyRankingResponse>('/rankings/me').then((r) => r.data),
};
