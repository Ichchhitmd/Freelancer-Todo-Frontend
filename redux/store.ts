import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices';
import gadgetReducer from './slices/gadgetSlices';
import companyReducer from './slices/companySlices';
import expenseReducer from './slices/expensesSlices';
import reimbursementReducer from './slices/reimbursementSlices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gadgets: gadgetReducer,
    company: companyReducer,
    expenses: expenseReducer,
    reimbursement: reimbursementReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
