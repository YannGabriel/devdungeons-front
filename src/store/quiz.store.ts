import { create } from 'zustand';
import type { QuizSession, QuizAnswerResponse, QuizFinalResults } from '../types/api';

type QuizPhase = 'setup' | 'playing' | 'answered' | 'completed';

interface QuizStore {
  phase: QuizPhase;
  session: QuizSession | null;
  selectedLanguageId: string;
  selectedLevelId: string;
  selectedAlternativeId: string | null;
  answerResult: QuizAnswerResponse | null;
  finalResults: QuizFinalResults | null;
  /** Stored separately so advance() can apply it atomically */
  nextQuestionOrder: number | null;

  setLanguageId: (id: string) => void;
  setLevelId: (id: string) => void;
  setSession: (s: QuizSession) => void;
  selectAlternative: (id: string) => void;
  setAnswerResult: (r: QuizAnswerResponse) => void;
  advance: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  phase: 'setup',
  session: null,
  selectedLanguageId: '',
  selectedLevelId: '',
  selectedAlternativeId: null,
  answerResult: null,
  finalResults: null,
  nextQuestionOrder: null,

  setLanguageId: (id) => set({ selectedLanguageId: id }),
  setLevelId: (id) => set({ selectedLevelId: id }),

  setSession: (session) =>
    set({
      session,
      phase: 'playing',
      selectedAlternativeId: null,
      answerResult: null,
      nextQuestionOrder: null,
    }),

  selectAlternative: (id) => set({ selectedAlternativeId: id }),

  setAnswerResult: (r) =>
    set((state) => {
      const updatedSession = state.session
        ? {
            ...state.session,
            progress: {
              ...state.session.progress,
              questions_answered: r.session.questions_answered,
              questions_total: r.session.questions_total,
              current_score: r.session.current_score,
              total_xp_earned: r.session.total_xp_earned,
              is_complete: r.session.is_complete,
              accuracy_percentage:
                r.session.questions_answered > 0
                  ? Math.round(
                      (r.session.current_score / r.session.questions_answered) * 100,
                    )
                  : 0,
              completed_at: r.session.completed_at,
              // current_question_order intentionally NOT advanced here.
              // It still points to the just-answered question so the
              // 'answered' phase can display it correctly.
              // advance() will move it to next_question_order.
            },
            questions: state.session.questions.map((q) =>
              q.order === r.question_order
                ? {
                    ...q,
                    answered: true,
                    correct: r.correct,
                    correct_alternative_id: r.correct_alternative_id,
                    xp_earned: r.xp_earned,
                    your_answer: state.selectedAlternativeId,
                    answered_at: new Date().toISOString(),
                  }
                : q,
            ),
          }
        : state.session;

      return {
        answerResult: r,
        finalResults: r.final_results,
        session: updatedSession,
        nextQuestionOrder: r.session.next_question_order,
        phase: r.session.is_complete ? 'completed' : 'answered',
      };
    }),

  advance: () =>
    set((state) => {
      // Atomically advance current_question_order to the next question
      const session =
        state.session && state.nextQuestionOrder !== null
          ? {
              ...state.session,
              progress: {
                ...state.session.progress,
                current_question_order: state.nextQuestionOrder,
              },
            }
          : state.session;

      return {
        phase: 'playing',
        selectedAlternativeId: null,
        answerResult: null,
        session,
      };
    }),

  reset: () =>
    set({
      phase: 'setup',
      session: null,
      selectedLanguageId: '',
      selectedLevelId: '',
      selectedAlternativeId: null,
      answerResult: null,
      finalResults: null,
      nextQuestionOrder: null,
    }),
}));
