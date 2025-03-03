import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import React from 'react';

interface HistoryControlsProps {
  filter: 'all' | 'win' | 'lose';
  sortOrder: 'asc' | 'desc';
  onFilterChange: (e: SelectChangeEvent<'all' | 'win' | 'lose'>) => void;
  onSortChange: (e: SelectChangeEvent<'asc' | 'desc'>) => void;
}

const HistoryControls: React.FC<HistoryControlsProps> = ({
  filter,
  sortOrder,
  onFilterChange,
  onSortChange
}) => (
  <div className="flex gap-4 mb-4">
    <Select value={filter} onChange={onFilterChange} size="small">
      <MenuItem value="all">Все</MenuItem>
      <MenuItem value="win">Победы</MenuItem>
      <MenuItem value="lose">Проигрыши</MenuItem>
    </Select>
    <Select value={sortOrder} onChange={onSortChange} size="small">
      <MenuItem value="desc">Новые сначала</MenuItem>
      <MenuItem value="asc">Старые сначала</MenuItem>
    </Select>
  </div>
);

export default HistoryControls;