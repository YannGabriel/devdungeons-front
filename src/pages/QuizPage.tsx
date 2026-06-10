import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Zap, BookOpen } from 'lucide-react';
import { useQuizStore } from '../store/quiz.store';
import { useStartQuiz, useAnswerQuiz, useQuizHistory } from '../hooks/useQuiz';
import { useLevels } from '../hooks/useLevels';
import { useLanguages } from '../hooks/useLanguages';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentQuestion } from '../adapters/quiz.adapter';
import { QuestionCard } from '../components/organisms/QuestionCard';
import { QuizResults } from '../components/organisms/QuizResults';
import { QuizSetupCard, type CompletedSession } from '../components/organisms/QuizSetupCard';
import { Spinner } from '../components/atoms/Spinner';
import { Progress } from '../components/atoms/Progress';
import { Badge } from '../components/atoms/Badge';

export function QuizPage() {
  const { sessionId: paramSessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const {
    phase,
    session,
    selectedAlternativeId,
    answerResult,
    finalResults,
    setSession,
    selectAlternative,
    setAnswerResult,
    advance,
    reset,
  } = useQuizStore();

  const { data: languages } = useLanguages();
  const { data: levels } = useLevels();
  const { data: history } = useQuizHistory();

  // Map: languageId → levelId → { sessionId, accuracy } (most recent completed session)
  const completedMap = useMemo(() => {
    const map: Record<string, Record<string, CompletedSession>> = {};
    history
      ?.filter((h) => h.status === 'COMPLETED' && h.level)
      .forEach((h) => {
        const langId = h.language.id;
        const levelId = h.level!.id;
        if (!map[langId]) map[langId] = {};
        // history is sorted DESC — keep the first (most recent) entry
        if (!map[langId][levelId]) {
          map[langId][levelId] = { sessionId: h.id, accuracy: h.accuracy_percentage };
        }
      });
    return map;
  }, [history]);

  const startMutation = useStartQuiz();
  const answerMutation = useAnswerQuiz(session?.session_id ?? '');

  const [startingLanguageId, setStartingLanguageId] = useState<string | null>(null);

  useEffect(() => {
    if (paramSessionId && phase === 'setup') {
      /* resume handled server-side when user clicks Acessar */
    }
  }, [paramSessionId, phase]);

  useEffect(() => {
    if (phase === 'completed') {
      refreshUser();
    }
  }, [phase, refreshUser]);

  const handleStart = async (languageId: string, levelId: string) => {
    setStartingLanguageId(languageId);
    try {
      const data = await startMutation.mutateAsync({
        language_id: languageId,
        level_id: levelId || undefined,
      });
      setSession(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
      alert(Array.isArray(msg) ? msg.join('\n') : (msg ?? 'Erro ao iniciar quiz'));
    } finally {
      setStartingLanguageId(null);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAlternativeId || !session) return;
    const currentQ = getCurrentQuestion(session);
    if (!currentQ) return;
    try {
      const result = await answerMutation.mutateAsync({
        question_id: currentQ.question_id,
        alternative_id: selectedAlternativeId,
      });
      setAnswerResult(result);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg ?? 'Erro ao enviar resposta');
    }
  };

  const handleRetry = () => {
    reset();
    navigate('/quiz', { replace: true });
  };

  /* ── COMPLETED ── */
  if (phase === 'completed' && finalResults && session) {
    return (
      <div className="animate-fade-in">
        <QuizResults results={finalResults} session={session} onRetry={handleRetry} />
      </div>
    );
  }

  /* ── PLAYING / ANSWERED ── */
  if ((phase === 'playing' || phase === 'answered') && session) {
    const currentQ = getCurrentQuestion(session);
    const progress = session.progress;
    const displayNumber =
      phase === 'answered' ? progress.questions_answered : progress.questions_answered + 1;

    if (!currentQ && phase === 'playing') {
      return (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <Spinner size="lg" />
          <p className="text-sm text-text-3">Carregando questão...</p>
        </div>
      );
    }

    if (!currentQ && phase === 'answered' && !answerResult?.session.is_complete) {
      return (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        {/* Session header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-text">{session.language.name}</h1>
            <p className="text-xs text-text-3">{session.level?.name ?? 'Todos os níveis'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{progress.current_score} acertos</Badge>
            {progress.total_xp_earned > 0 && (
              <Badge variant="success">
                <Zap size={11} />
                +{progress.total_xp_earned} XP
              </Badge>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1">
          <Progress
            value={(progress.questions_answered / progress.questions_total) * 100}
            size="xs"
            label="Progresso do quiz"
          />
          <div className="flex justify-between text-xs text-text-3">
            <span>{progress.questions_answered} de {progress.questions_total} respondidas</span>
            <span>{Math.round(progress.accuracy_percentage)}% acertos</span>
          </div>
        </div>

        {currentQ && (
          <QuestionCard
            question={currentQ}
            questionNumber={displayNumber}
            totalQuestions={progress.questions_total}
            selectedAlternativeId={selectedAlternativeId}
            answerResult={phase === 'answered' ? answerResult : null}
            isSubmitting={answerMutation.isPending}
            onSelectAlternative={selectAlternative}
            onSubmit={handleSubmitAnswer}
            onNext={advance}
          />
        )}
      </div>
    );
  }

  /* ── SETUP ── */
  const isAnyStarting = !!startingLanguageId;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text">Iniciar Quiz</h1>
        <p className="mt-1 text-sm text-text-3">
          Escolha uma linguagem, selecione o nível e clique em Acessar
        </p>
      </div>

      {/* Language cards grid */}
      {!languages || !levels ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {languages.map((lang) => (
            <QuizSetupCard
              key={lang.id}
              language={lang}
              levels={levels}
              completedSessions={completedMap[lang.id] ?? {}}
              isStarting={startingLanguageId === lang.id}
              disabled={isAnyStarting}
              onStart={handleStart}
              onReview={(sessionId) => navigate(`/quiz/review/${sessionId}`)}
            />
          ))}
        </div>
      )}

      {startMutation.isError && (
        <p className="text-sm text-error text-center">
          {(startMutation.error as { response?: { data?: { message?: string } } })
            ?.response?.data?.message ?? 'Sem questões disponíveis para esta combinação.'}
        </p>
      )}

    </div>
  );
}
