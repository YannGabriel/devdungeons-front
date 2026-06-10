import type { QuizSession, QuizQuestionItem } from '../types/api';

/**
 * Returns the question currently pointed to by current_question_order.
 * The store keeps this pointing to the answered question during 'answered' phase,
 * and advances it to the next question only when advance() is called.
 */
export function getCurrentQuestion(session: QuizSession): QuizQuestionItem | null {
  if (session.progress.is_complete) return null;
  const order = session.progress.current_question_order;
  return session.questions.find((q) => q.order === order) ?? null;
}

export function accuracyStatus(pct: number): 'success' | 'warning' | 'error' {
  if (pct >= 70) return 'success';
  if (pct >= 40) return 'warning';
  return 'error';
}

export function levelDisplayName(levelName: string | undefined | null): string {
  return levelName ?? 'Todos os níveis';
}
