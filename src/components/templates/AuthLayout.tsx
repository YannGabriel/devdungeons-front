import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../atoms/Spinner';

export function AuthLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex w-[42%] bg-[#060606] flex-col items-center justify-between py-14 px-10 flex-shrink-0">
        <img
          src="/devdungeons-header.svg"
          alt="DevDungeons"
          className="w-52"
        />

        <div className="text-center px-4">
          <p className="text-white/90 font-semibold text-lg leading-snug">
            Seja bem-vindo(a) ao <span className="text-red-500">DevDungeons</span>!
          </p>
          <p className="mt-3 text-white/50 text-sm leading-relaxed">
            Aqui você ultrapassa as barreiras do aprendizado e evolui suas habilidades
            em programação de forma rápida, prática e intuitiva.
          </p>
        </div>

        <img
          src="/question-dragon.svg"
          alt="Dragão"
          className="w-48 drop-shadow-2xl"
        />
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-[#f2f2f2]">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <img src="/devdungeons-header.svg" alt="DevDungeons" className="h-8" />
        </div>

        <div className="w-full max-w-sm animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
