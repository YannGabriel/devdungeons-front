import { Link } from 'react-router-dom';
import { Code2, ArrowRight } from 'lucide-react';
import { getLangConfig } from '../../lib/langConfig';
import type { ProgrammingLanguage } from '../../types/api';
import { cn } from '../../lib/utils';

interface LanguageCardProps {
  language: ProgrammingLanguage;
  userLevel?: string;
  className?: string;
}

const LEVEL_STYLES: Record<string, string> = {
  'Básico':        'text-success',
  'Iniciante':     'text-success',
  'Intermediário': 'text-warning',
  'Avançado':      'text-error',
};

export function LanguageCard({ language, userLevel, className }: LanguageCardProps) {
  const config = getLangConfig(language.name);

  return (
    <Link
      to={`/languages/${language.id}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-surface',
        'hover:shadow-md hover:border-border-2 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
    >
      {/* Logo area */}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-8">
        {config ? (
          <config.Icon
            size={72}
            style={{ color: config.color }}
            aria-label={language.name}
          />
        ) : (
          <Code2
            size={72}
            className="text-text-3"
            aria-label={language.name}
          />
        )}

        <div className="text-center">
          <h3 className="font-bold text-base text-text group-hover:text-accent transition-colors">
            {language.name}
          </h3>
          {userLevel && (
            <p
              className={cn(
                'mt-0.5 text-xs font-semibold uppercase tracking-wider',
                LEVEL_STYLES[userLevel] ?? 'text-text-3',
              )}
            >
              {userLevel}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center gap-1.5 border-t border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-3 group-hover:text-red-500 group-hover:bg-red-50 transition-colors">
        Acessar
        <ArrowRight size={13} />
      </div>
    </Link>
  );
}
