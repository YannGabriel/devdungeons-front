import { Outlet } from 'react-router-dom';
import { Header } from '../organisms/Header';

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
