import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Credenciais inválidas'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField
        label="E-mail"
        required
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <FormField
        label="Senha"
        required
        type="password"
        autoComplete="current-password"
        placeholder="••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p
          role="alert"
          className="rounded-md bg-error-bg border border-error/20 px-3 py-2 text-sm text-error"
        >
          {error}
        </p>
      )}

      <Button type="submit" fullWidth loading={isLoading} size="lg">
        Entrar
      </Button>

      <p className="text-center text-sm text-text-3">
        Não tem conta?{' '}
        <Link to="/register" className="font-medium text-text hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
