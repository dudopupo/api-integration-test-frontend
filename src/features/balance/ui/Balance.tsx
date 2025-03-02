'use client';
import { 
  Box, 
  Typography, 
  TextField,  
  Button,
  CircularProgress,
} from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';
import { API } from '@/shared/api/base-api';
import { useNotificationStore } from '@/features/notifycation/store';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// Схема валидации для баланса
const balanceSchema = z.object({
  balance: z.number().positive('Баланс должен быть положительным числом')
});

type BalanceFormValues = z.infer<typeof balanceSchema>;

export function Balance() {
  const [userBalance, setUserBalance] = useState(0)
  const [firstBalance, setFirstBalance] = useState(false)
  const { showNotification } = useNotificationStore();
  const { data: balance, isPending } = useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      try {
        const response = await API.axiosInstance.post('/balance', { balance: userBalance });
        return response.data.balance as number;
      } catch (error) {
        console.log(error);
        setFirstBalance(true)
      }
    },
    refetchInterval: 1000 * 60 * 10
  });

  const { mutate: setBalance, isPending: isSetting } = useMutation({
    mutationFn: async (amount: number) =>  {
      const response = await API.axiosInstance.post('/balance', { balance: amount })
      setUserBalance(response.data.balance)
      return response.data.balance
    },
        
    onSuccess: () => {
    //   showNotification('Баланс успешно обновлен', 'success');
    },
    onError: (error) => {
      showNotification((error as Error).message || 'Ошибка обновления баланса', 'error');
  }});

  const { mutate: checkBalance } = useMutation({
    mutationFn: async () =>{ 
      const response = await API.axiosInstance.post('/check-balance', { expected_balance: userBalance })
      
      if (response.data.correct_balance) {
        setTimeout(() => {
            showNotification("Проверка баланса осуществлена статус баланса не актуален", "error");
        }, 1000)
        setTimeout(() => {
            showNotification("Баланс актуализируется", "info");
        }, 2000)
        setTimeout(() => {
            console.log(response.data);
            showNotification(`Баланс актуализирован расхождение ${response.data.correct_balance - userBalance }`, "success");
            setBalance(response.data.correct_balance)
        }, 4000)
      } else {
        showNotification("Баланс синхронизирован", "success");
      }

      return response.data.balance;
    },
  });

  const { 
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BalanceFormValues>({
    resolver: zodResolver(balanceSchema),
    defaultValues: { balance: 0 }
  });

  return (
    <Box className="max-w-md mx-auto p-6 space-y-6">
      <Box className="text-center p-4 bg-gray-50 rounded-lg">
        <Typography variant="h6" className="mb-2 text-gray-600">
          Текущий баланс
        </Typography>
        <Typography 
          variant="h3" 
          className={`transition-all duration-300 ${
            isPending ? 'text-gray-400' : 'text-green-600'
          }`}
        >
          {isPending ? '...' : `${balance?.toFixed(2) ?? 'Баланс не установлен'}`}
        </Typography>
      </Box>

      {firstBalance && <Box className="space-y-4">
        <form onSubmit={handleSubmit((data) => setBalance(data.balance))}>
          <TextField
            fullWidth
            label="Установить баланс"
            type="number"
            error={!!errors.balance}
            helperText={errors.balance?.message}
            {...register('balance', { valueAsNumber: true })}
            InputProps={{
              endAdornment: (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSetting}
                  className="ml-2"
                >
                  {isSetting ? (
                    <CircularProgress size={24} className="text-white" />
                  ) : (
                    'Обновить'
                  )}
                </Button>
              )
            }}
          />
        </form>
      </Box>
}

      {/* Проверка баланса */}
      <Button
        fullWidth
        variant="outlined"
        onClick={() => checkBalance()}
        className="mt-4"
      >
        Проверить баланс
      </Button>
    </Box>
  );
};