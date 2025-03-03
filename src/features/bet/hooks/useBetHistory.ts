import { useState, useEffect } from 'react';
import { BetHistoryItem } from '../types/betTypes';

export const useBetHistory = () => {
  const [betHistory, setBetHistory] = useState<BetHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('betHistory') || '[]');
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('betHistory', JSON.stringify(betHistory));
  }, [betHistory]);

  return { betHistory, setBetHistory };
};
