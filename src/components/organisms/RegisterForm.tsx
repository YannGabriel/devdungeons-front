import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

export function RegisterForm() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    try {
      await register({ username, email, password });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erro ao criar conta. Tente novamente.'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField
        label="Nome de usuário"
        required
        type="text"
        autoComplete="username"
        placeholder="joaosilva"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

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
        autoComplete="new-password"
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint="Mínimo de 6 caracteres"
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
        Criar conta
      </Button>

      <p className="text-center text-sm text-text-3">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-text hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
