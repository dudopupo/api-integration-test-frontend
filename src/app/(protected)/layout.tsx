'use client';

import { useAuthStore } from '@/features/auth/store';
import { Sidebar } from '@/widgets/layout/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLogin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const state = useAuthStore.getState();
      const isInitialized = state.userId !== null || state.userName !== null || state.signature !== null;
      setIsLoading(!isInitialized);
    };

    checkAuth();

    const unsubscribe = useAuthStore.subscribe((state) => {
      const initialized = state.userId !== null || state.userName !== null || state.signature !== null;
      setIsLoading(!initialized);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {    
    if (isLoading && !isLogin) {
      router.push('/login');
    }
  }, [isLoading, isLogin, router]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>
    </div>
  );
}
