import { ReactNode } from 'react';
import Header  from './Header';
import { useAppContext } from '../context/AppContext';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { loading, error, clearError } = useAppContext();
  return (
    <div className="min-h-full px-15">
      <Header />
      {loading && <div className="p-4 text-sm text-gray-400">Loading...</div>}
      {error && (
        <div className="p-4 text-sm bg-red-900/30 border border-red-500/40 rounded mb-4 text-red-300 flex justify-between">
          <span>{error}</span>
          <button className="underline text-xs" onClick={clearError}>Dismiss</button>
        </div>
      )}
      <main>{children}</main>
    </div>
  );
};