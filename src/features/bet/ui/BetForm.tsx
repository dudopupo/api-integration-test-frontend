import { TextField, Button, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const betSchema = z.object({
  amount: z.number().min(1).max(10000)
});

type BetFormValues = z.infer<typeof betSchema>;

const BetForm: React.FC<{
  onSubmit: (data: BetFormValues) => void;
  isPlacing: boolean;
  initialAmount?: number | null;
}> = ({ onSubmit, isPlacing, initialAmount }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BetFormValues>({
    resolver: zodResolver(betSchema)
  });

  useEffect(() => {
    if (initialAmount) setValue('amount', initialAmount);
  }, [initialAmount, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        fullWidth
        label="Сумма ставки"
        type="number"
        {...register('amount', { valueAsNumber: true })}
        error={!!errors.amount}
        helperText={errors.amount?.message}
        InputProps={{
          endAdornment: (
            <Button
              type="submit"
              variant="contained"
              disabled={isPlacing}
              className="ml-2"
            >
              {isPlacing ? <CircularProgress size={24} /> : 'Поставить'}
            </Button>
          )
        }}
      />
    </form>
  );
};

export default BetForm;