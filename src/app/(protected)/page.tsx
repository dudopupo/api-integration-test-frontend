'use client';
import { API } from '@/shared/api/base-api';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const fetchData = async () => {
  const response = await API.axiosInstance.post('/protected', { data: 'test' });
  return response.data;
};

export default function ProtectedPage() {
  const { isLogin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log(isLogin);
    
    if (!isLogin) {
      router.push('/login');
    }
  },[isLogin, router]);

  const { data } = useQuery({ 
    queryKey: ['protected'], 
    queryFn: fetchData,
    enabled: isLogin // Запрос выполняется только если авторизован
  });

  if (!isLogin) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Защищенная страница</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}