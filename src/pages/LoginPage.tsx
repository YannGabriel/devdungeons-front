import { LoginForm } from '../components/organisms/LoginForm';

export function LoginPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text">Bem-vindo de volta</h1>
        <p className="mt-1 text-sm text-text-3">
          Entre para continuar sua jornada
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
