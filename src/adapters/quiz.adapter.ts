import type { QuizSession, QuizQuestionItem } from '../types/api';

/** Returns the current unanswered question based on session progress. */
export function getCurrentQuestion(session: QuizSession): QuizQuestionItem | null {
  if (session.progress.is_complete) return null;
  const order = session.progress.current_question_order;
  return session.questions.find((q) => q.order === order && !q.answered) ?? null;
}

/** Maps raw accuracy percentage to a semantic status string. */
export function accuracyStatus(pct: number): 'success' | 'warning' | 'error' {
  if (pct >= 70) return 'success';
  if (pct >= 40) return 'warning';
  return 'error';
}

/** Returns the label for a quiz level. */
export function levelDisplayName(levelName: string | undefined | null): string {
  return levelName ?? 'Todos os níveis';
}
