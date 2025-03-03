import { Box, Button, Chip, Typography } from '@mui/material';
import { Casino } from '@mui/icons-material';
import { JSX } from 'react';

interface RecommendedBetSectionProps {
  recommendedBet: number;
  onUse: (amount: number) => void;
  updateRecommendation: () => void;
  isFetching: boolean;
}

const RecommendedBetSection = ({
  recommendedBet,
  onUse,
  isFetching
}: RecommendedBetSectionProps): JSX.Element => (
  <Box className="mb-6 p-4 bg-gray-50 rounded">
    <div className="flex items-center justify-between mb-3">
      <Typography variant="h6">Рекомендуемая ставка</Typography>
    </div>
    <div className="flex items-center gap-2">
      <Chip
        label={isFetching ? '...' : `${recommendedBet} ₽`}
        color="primary"
        icon={<Casino />}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={() => onUse(recommendedBet)}
        disabled={isFetching}
      >
        Использовать
      </Button>
    </div>
  </Box>
);

export default RecommendedBetSection;