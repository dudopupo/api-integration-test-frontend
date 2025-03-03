// components/BetHistoryTable.tsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { API } from '@/shared/api/base-api';
import { useNotificationStore } from '@/features/notifycation/store';
import { BetHistoryItem } from '../types/betTypes';

const BetHistoryTable = ({ history, setBetHistory }: { 
  history: BetHistoryItem[];
  setBetHistory: (history: BetHistoryItem[]) => void;
}) => {
  const { showNotification } = useNotificationStore();

  const { mutate: checkBetResult } = useMutation({
    mutationFn: async (betId: string) => {
      const response = await API.axiosInstance.post<{ win: number; message: string }>('/win', { bet_id: betId });
      return { data: response.data, betId };
    },
    /**
     * Mutation function to check the result of a bet.
     * @param {string} betId The ID of the bet to check.
     * @returns {Promise<{ data: { win: number; message: string }, betId: string }>}
     */
    onSuccess: ({ data, betId }: { data: { win: number; message: string }, betId: string }) => {
      const result = data.win > 0 ? 'win' : 'lose';
      const updatedHistory = history.map(bet => 
        bet.id === betId ? { 
          ...bet, 
          result,
          outcome: data.win,
          date: new Date().toISOString()
        } : bet
      ) as BetHistoryItem[];
      
      // Обновляем состояние через пропс
      setBetHistory(updatedHistory);
      showNotification(data.message, result === 'win' ? 'success' : 'error');
    },
    onError: () => {
      showNotification('Ошибка проверки результата', 'error');
    }
  });

  const handleCheckResult = (bet: BetHistoryItem) => {
    if (bet.result === 'pending') {
      checkBetResult(bet.id);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Сумма</TableCell>
            <TableCell>Результат</TableCell>
            <TableCell>Выигрыш</TableCell>
            <TableCell>Дата</TableCell>
            <TableCell>Проверка</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((bet) => (
            <TableRow key={bet.id}>
              <TableCell>{bet.amount.toFixed(2)} ₽</TableCell>
              <TableCell>
                <Chip
                  label={bet.result === 'win' ? 'Победа' : bet.result === 'lose' ? 'Проигрыш' : 'Ожидание'}
                  color={bet.result === 'win' ? 'success' : bet.result === 'lose' ? 'error' : 'warning'}
                />
              </TableCell>
              <TableCell>
                {bet.outcome !== undefined ? `${bet.outcome.toFixed(2)} ₽` : '---'}
              </TableCell>
              <TableCell>
                {new Date(bet.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button 
                  onClick={() => handleCheckResult(bet)}
                  disabled={bet.result !== 'pending'}
                  variant="outlined"
                  size="small"
                >
                  {bet.result === 'pending' ? 'Проверить' : 'Завершено'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BetHistoryTable;