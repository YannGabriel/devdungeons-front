/* ================================================================
   API Contract Types — adapted from API_DOCUMENTATION.md
   NEVER modify the response shapes here to match the UI;
   adapt in adapters/hooks instead.
   ================================================================ */

/* ---------- Auth ---------- */
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  user_level: number;
  user_experience: number;
  languages?: UserLanguageLevel[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  languageIds?: string[];
  levelId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/* ---------- Programming Languages ---------- */
export interface ProgrammingLanguage {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/* ---------- Knowledge Levels ---------- */
export interface KnowledgeLevel {
  id: string;
  name: string;
  xp: number;
}

/* ---------- User Language Level ---------- */
export interface UserLanguageLevel {
  id: string;
  user_id?: string;
  language: Pick<ProgrammingLanguage, "id" | "name">;
  level: KnowledgeLevel;
  created_at?: string;
  updated_at?: string;
}

/* ---------- Questions ---------- */
export interface Alternative {
  id: string;
  descricao: string;
  correta?: boolean; // only revealed after answering in quiz
}

export interface Question {
  id: string;
  enunciado: string;
  language: Pick<ProgrammingLanguage, "id" | "name">;
  level: KnowledgeLevel;
  alternatives: Alternative[];
}

export interface AnswerQuestionResponse {
  question_id: string;
  chosen_alternative_id: string;
  correct: boolean;
  correct_alternative_id: string;
  question_xp: number;
  xp_earned: number;
  user_update: { message: string };
}

/* ---------- Quiz ---------- */
export type QuizStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export interface QuizQuestionItem {
  order: number;
  question_id: string;
  enunciado: string;
  alternatives: Alternative[];
  answered: boolean;
  your_answer: string | null;
  correct: boolean | null;
  correct_alternative_id: string | null;
  xp_earned: number;
  answered_at: string | null;
}

export interface QuizProgress {
  questions_answered: number;
  questions_total: number;
  current_score: number;
  total_xp_earned: number;
  accuracy_percentage: number;
  current_question_order: number;
  is_complete: boolean;
  completed_at: string | null;
}

export interface QuizSession {
  session_id: string;
  status: QuizStatus;
  language: Pick<ProgrammingLanguage, "id" | "name">;
  level: KnowledgeLevel | null;
  progress: QuizProgress;
  questions: QuizQuestionItem[];
}

export interface QuizAnswerSessionState {
  id: string;
  questions_answered: number;
  questions_total: number;
  current_score: number;
  total_xp_earned: number;
  is_complete: boolean;
  next_question_order: number | null;
  completed_at: string | null;
}

export interface QuizFinalResultsSummaryItem {
  order: number;
  enunciado: string;
  your_answer_id: string;
  correct_answer_id: string;
  correct: boolean;
  xp_earned: number;
}

export interface QuizFinalResults {
  correct_answers: number;
  wrong_answers: number;
  accuracy_percentage: number;
  total_xp_earned: number;
  questions_summary: QuizFinalResultsSummaryItem[];
}

export interface QuizAnswerResponse {
  question_order: number;
  correct: boolean;
  correct_alternative_id: string;
  xp_earned: number;
  session: QuizAnswerSessionState;
  final_results: QuizFinalResults | null;
}

export interface QuizHistoryItem {
  id: string;
  status: QuizStatus;
  language: Pick<ProgrammingLanguage, "name">;
  level: Pick<KnowledgeLevel, "name" | "xp"> | null;
  score: number;
  total_questions: number;
  accuracy_percentage: number;
  total_xp_earned: number;
  started_at: string;
  completed_at: string | null;
}

/* ---------- Rankings (new additive endpoint) ---------- */
export interface RankingEntry {
  position: number;
  id: string;
  username: string;
  user_level: number;
  user_experience: number;
  total_xp: number;
}

export interface RankingResponse {
  data: RankingEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ---------- API Error ---------- */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
