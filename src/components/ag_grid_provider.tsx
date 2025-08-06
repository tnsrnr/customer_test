'use client';

import { useEffect } from 'react';

interface AGGridProviderProps {
  children: React.ReactNode;
}

export function AGGridProvider({ children }: AGGridProviderProps) {
  useEffect(() => {
    console.log('AG Grid Provider mounted');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 