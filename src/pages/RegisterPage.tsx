import { RegisterForm } from '../components/organisms/RegisterForm';

export function RegisterPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text">Criar conta</h1>
        <p className="mt-1 text-sm text-text-3">
          Comece sua jornada como programador
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
