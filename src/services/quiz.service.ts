import { api } from '../lib/api';
import type { QuizSession, QuizAnswerResponse, QuizHistoryItem } from '../types/api';

export interface StartQuizPayload {
  language_id: string;
  level_id?: string;
}

export interface AnswerQuizPayload {
  question_id: string;
  alternative_id: string;
}

export const quizService = {
  start: (payload: StartQuizPayload) =>
    api.post<QuizSession>('/quiz/start', payload).then((r) => r.data),

  answer: (sessionId: string, payload: AnswerQuizPayload) =>
    api
      .post<QuizAnswerResponse>(`/quiz/${sessionId}/answer`, payload)
      .then((r) => r.data),

  getSession: (sessionId: string) =>
    api.get<QuizSession>(`/quiz/${sessionId}`).then((r) => r.data),

  getHistory: () =>
    api.get<QuizHistoryItem[]>('/quiz/history').then((r) => r.data),
};
