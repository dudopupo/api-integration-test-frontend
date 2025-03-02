'use client';

import { useAuthStore } from '@/features/auth/store';
import { Sidebar } from '@/widgets/layout/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLogin, userId, userName } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const hasAuth = !!userId || !!userName;
      setIsLoading(false);
      if (!hasAuth && !isLogin) {
        router.push('/login');
      }
    };

    checkAuth();
    
    // Подписка на изменения хранилища
    const unsubscribe = useAuthStore.subscribe((state) => {
      const hasAuth = !!state.userId || !!state.userName;
      if (!hasAuth && !state.isLogin) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router, isLogin, userId, userName]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <div>
        <Sidebar />
        <main>
          {children}
        </main>
      </div>
  );
}
