import { api } from '../lib/api';
import type { Question, AnswerQuestionResponse } from '../types/api';

export const questionsService = {
  getAll: () =>
    api.get<Question[]>('/questions').then((r) => r.data),

  getByLanguage: (languageId: string) =>
    api.get<Question[]>(`/questions/by-language/${languageId}`).then((r) => r.data),

  getByLevel: (levelId: string) =>
    api.get<Question[]>(`/questions/by-level/${levelId}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<Question>(`/questions/${id}`).then((r) => r.data),

  answer: (questionId: string, alternativeId: string) =>
    api
      .post<AnswerQuestionResponse>(`/questions/${questionId}/answer`, {
        alternative_id: alternativeId,
      })
      .then((r) => r.data),
};
