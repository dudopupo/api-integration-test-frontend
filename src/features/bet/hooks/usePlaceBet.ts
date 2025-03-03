// hooks/usePlaceBet.ts
import { 
  UseMutationResult, 
  useMutation 
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { API } from '@/shared/api/base-api';
import { BetHistoryItem } from '../types/betTypes';

interface ErrorResponse {
  message: string;
}

export const usePlaceBet = (
  setBetHistory: React.Dispatch<React.SetStateAction<BetHistoryItem[]>>,
  showNotification: (message: string, type: "success" | "error") => void
): [
  (amount: number) => Promise<BetHistoryItem | undefined>,
  UseMutationResult<BetHistoryItem, AxiosError<ErrorResponse>, number>
] => {
  const mutation = useMutation<
    BetHistoryItem,
    AxiosError<ErrorResponse>,
    number
  >({
    mutationFn: async (amount) => {
      const response = await API.axiosInstance.post<{ 
        message: string; 
        bet_id: string 
      }>("/bet", { bet: amount });
      
      return {
        id: response.data.bet_id,
        amount,
        date: new Date().toISOString(),
        result: 'pending' as const
      };
    },
    onSuccess: (data) => {
      setBetHistory(prev => [data, ...prev]);
      showNotification("Ставка размещена!", "success");
    },
    onError: (error) => {
      showNotification(
        error.response?.data?.message || "Ошибка ставки",
        "error"
      );
    }
  });

  const placeBet = async (amount: number): Promise<BetHistoryItem | undefined> => {
    try {
      return await mutation.mutateAsync(amount);
    } catch {
      return undefined;
    }
  };

  return [placeBet, mutation];
};