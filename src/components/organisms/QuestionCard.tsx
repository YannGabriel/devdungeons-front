import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { QuestionAlternative } from '../molecules/QuestionAlternative';
import type { QuizQuestionItem, QuizAnswerResponse } from '../../types/api';

interface QuestionCardProps {
  question: QuizQuestionItem;
  questionNumber: number;
  totalQuestions: number;
  selectedAlternativeId: string | null;
  answerResult: QuizAnswerResponse | null;
  isSubmitting: boolean;
  onSelectAlternative: (id: string) => void;
  onSubmit: () => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAlternativeId,
  answerResult,
  isSubmitting,
  onSelectAlternative,
  onSubmit,
  onNext,
}: QuestionCardProps) {
  const answered = !!answerResult;
  const correct = answerResult?.correct ?? false;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Question header */}
      <div className="flex items-start justify-between gap-4">
        <Badge variant="outline">
          Questão {questionNumber} de {totalQuestions}
        </Badge>
        {answered && (
          <Badge variant={correct ? 'success' : 'error'}>
            {correct ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} />
                +{answerResult.xp_earned} XP
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <XCircle size={11} />
                Incorreto
              </span>
            )}
          </Badge>
        )}
      </div>

      {/* Question text */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <p className="text-base leading-relaxed text-text font-medium">
          {question.enunciado}
        </p>
      </div>

      {/* Alternatives */}
      <div className="flex flex-col gap-2">
        {question.alternatives.map((alt, idx) => {
          let result: 'correct' | 'wrong' | 'correct-answer' | undefined;
          if (answered) {
            if (alt.id === selectedAlternativeId && correct) result = 'correct';
            else if (alt.id === selectedAlternativeId && !correct) result = 'wrong';
            else if (alt.id === answerResult!.correct_alternative_id && !correct)
              result = 'correct-answer';
          }

          return (
            <QuestionAlternative
              key={alt.id}
              alternative={alt}
              index={idx}
              selected={selectedAlternativeId === alt.id}
              disabled={answered}
              result={result}
              onSelect={onSelectAlternative}
            />
          );
        })}
      </div>

      {/* Feedback banner */}
      {answered && (
        <div
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4 text-sm animate-fade-in',
            correct
              ? 'bg-success-bg border-success/20 text-success'
              : 'bg-error-bg border-error/20 text-error',
          )}
        >
          {correct
            ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
            : <XCircle size={18} className="flex-shrink-0 mt-0.5" />
          }
          <div>
            <p className="font-semibold">{correct ? 'Resposta correta!' : 'Resposta incorreta'}</p>
            {!correct && (
              <p className="mt-0.5 text-text-2 text-xs">
                A alternativa correta está destacada em verde acima.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!answered ? (
          <Button
            onClick={onSubmit}
            disabled={!selectedAlternativeId}
            loading={isSubmitting}
            size="lg"
          >
            Confirmar resposta
          </Button>
        ) : (
          <Button onClick={onNext} size="lg">
            {questionNumber === totalQuestions ? 'Ver resultados' : (
              <span className="flex items-center gap-1.5">
                Próxima questão
                <ArrowRight size={15} />
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
