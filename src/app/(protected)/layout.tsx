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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen transition-margin">
        {children}
      </main>
    </div>
  );
}
