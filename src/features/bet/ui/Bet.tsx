'use client';
import { JSX, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Box, Grid } from '@mui/material';
import { useNotificationStore } from '@/features/notifycation/store';
import { useBetHistory } from '../hooks/useBetHistory';
import RecommendedBetSection from './RecommendedBetSection';
import BetForm from './BetForm';
import HistoryControls from './HistoryControls';
import BetHistoryTable from './BetHistoryTable';
import { useRecommendedBet } from '../hooks/ useRecommendedBet';
import { usePlaceBet } from '../hooks/usePlaceBet';

type historyFilterProp = 'all' | 'win' | 'lose';

export function Bet(): JSX.Element {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const [historyFilter, setHistoryFilter] = useState<historyFilterProp>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBetAmount, setSelectedBetAmount] = useState<number | null>(null);
  const { betHistory, setBetHistory } = useBetHistory();
  const [placeBet, { isPlacing }] = usePlaceBet<number>(
    setBetHistory, 
    queryClient, 
    showNotification
  );
  const { recommendedBet, updateRecommendation, isFetching } = useRecommendedBet();

  const filteredHistory = betHistory
    .filter(bet => historyFilter === 'all' ? true : bet.result === historyFilter)
    .sort((a, b) => sortOrder === 'asc' 
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const handleUseClick = async () => {
      try {
        const { data } = await updateRecommendation();
        if (data !== undefined) {
          setSelectedBetAmount(data);
        }
      } catch (error) {
        console.log(error)
        showNotification('Ошибка получения ставки', 'error');
      }
    };

  return (
    <div className="container mx-auto p-6">
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Box className="p-6 bg-white rounded-lg shadow">
          <RecommendedBetSection
            recommendedBet={recommendedBet ?? 0}
            onUse={handleUseClick}
            updateRecommendation={updateRecommendation}
            isFetching={isFetching}
          />
          <BetForm
            onSubmit={(data: { amount: number }) => placeBet(data.amount)}
            isPlacing={isPlacing}
            initialAmount={selectedBetAmount}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
          <Box className="p-6 bg-white rounded-lg shadow">
            <HistoryControls
              filter={historyFilter}
              sortOrder={sortOrder}
              onFilterChange={(e) => setHistoryFilter(e.target.value as historyFilterProp)}
              onSortChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            />
            <BetHistoryTable 
              history={filteredHistory} 
              setBetHistory={setBetHistory} // Передаем функцию обновления
            />
          </Box>
        </Grid>
    </Grid>
  </div>
  );
}
