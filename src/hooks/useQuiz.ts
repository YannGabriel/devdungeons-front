import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizService, type StartQuizPayload, type AnswerQuizPayload } from '../services/quiz.service';
import { userKeys } from './useProfile';

export const quizKeys = {
  history: ['quiz', 'history'] as const,
  session: (id: string) => ['quiz', 'session', id] as const,
};

export function useQuizHistory() {
  return useQuery({
    queryKey: quizKeys.history,
    queryFn: quizService.getHistory,
  });
}

export function useQuizSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: quizKeys.session(sessionId ?? ''),
    queryFn: () => quizService.getSession(sessionId!),
    enabled: !!sessionId,
  });
}

export function useStartQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: StartQuizPayload) => quizService.start(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: quizKeys.history });
    },
  });
}

export function useAnswerQuiz(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AnswerQuizPayload) => quizService.answer(sessionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: quizKeys.history });
      qc.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}
