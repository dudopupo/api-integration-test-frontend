'use client';
import {apiClient} from '@/shared/api/api-client';
import { useQuery } from '@tanstack/react-query';

const fetchData = async () => {
  const response = await apiClient.post('/protected', { data: 'test' });
  return response.data;
};

export default function ProtectedPage() {
  const { data } = useQuery({ queryKey: ['protected'], queryFn: fetchData });

  return (
    <div>
      <h1 className="text-2xl font-bold">Нет доступа</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}