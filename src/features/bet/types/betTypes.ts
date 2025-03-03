export type BetHistoryItem = {
    id: string;
    amount: number;
    date: string;
    result: 'pending' | 'win' | 'lose';
    outcome?: number;
  };