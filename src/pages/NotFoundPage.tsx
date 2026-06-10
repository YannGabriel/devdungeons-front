import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/atoms/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 text-center">
      <AlertTriangle size={72} className="text-warning" strokeWidth={1.5} />
      <div>
        <h1 className="text-4xl font-black text-text">404</h1>
        <p className="mt-2 text-text-3">Esta página não existe na dungeon.</p>
      </div>
      <Link to="/dashboard">
        <Button variant="primary" size="lg">Voltar ao início</Button>
      </Link>
    </div>
  );
}
