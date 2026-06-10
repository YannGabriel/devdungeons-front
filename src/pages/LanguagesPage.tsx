import { BookOpen } from 'lucide-react';
import { useLanguages } from '../hooks/useLanguages';
import { useAuth } from '../contexts/AuthContext';
import { LanguageCard } from '../components/molecules/LanguageCard';
import { Spinner } from '../components/atoms/Spinner';

export function LanguagesPage() {
  const { data: languages, isLoading, isError } = useLanguages();
  const { user } = useAuth();

  /* Build a quick lookup: language.id → user's level name */
  const userLevelMap = Object.fromEntries(
    (user?.languages ?? []).map((ul) => [ul.language.id, ul.level.name]),
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen size={22} className="text-text-2 flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-text">Desafios</h1>
          <p className="text-sm text-text-3">
            Escolha uma linguagem e teste seus conhecimentos
          </p>
        </div>
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-error/20 bg-error-bg p-6 text-center">
          <p className="text-sm text-error">Erro ao carregar desafios. Tente novamente.</p>
        </div>
      )}

      {languages && (
        <>
          {languages.length === 0 ? (
            <div className="rounded-lg border border-border bg-bg-secondary p-16 text-center">
              <p className="text-sm text-text-3">Nenhuma linguagem disponível ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {languages.map((lang) => (
                <LanguageCard
                  key={lang.id}
                  language={lang}
                  userLevel={userLevelMap[lang.id]}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
