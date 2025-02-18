import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExpenseResponse } from 'types/expensesTypes';

interface ExpenseState {
  expenses: ExpenseResponse[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: null,
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setExpenses(state, action: PayloadAction<ExpenseResponse[]>) {
      state.expenses = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setExpenses, setError } = expenseSlice.actions;
export default expenseSlice.reducer;
