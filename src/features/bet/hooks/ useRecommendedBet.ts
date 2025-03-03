// hooks/useRecommendedBet.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { API } from '@/shared/api/base-api';

export const useRecommendedBet = () => {
  const queryClient = useQueryClient();
  
  const { 
    data: recommendedBet,
    refetch: updateRecommendation,
    isFetching,
  } = useQuery({
    queryKey: ['recommended-bet'],
    queryFn: async () => {
      const response = await API.axiosInstance.get('/bet');
      return response.data.bet;
    },
    enabled: false,
    staleTime: Infinity
  });

  // Новая функция для сброса кэша
  const resetRecommendation = () => {
    queryClient.removeQueries({ queryKey: ['recommended-bet'] });
  };

  return { 
    recommendedBet,
    updateRecommendation: async () => {
      await resetRecommendation();
      return updateRecommendation();
    },
    isFetching 
  };
};