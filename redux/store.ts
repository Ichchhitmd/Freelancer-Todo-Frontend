import { configureStore, createSelector } from '@reduxjs/toolkit';

import authReducer from './slices/authSlices';
import companyReducer from './slices/companySlices';
import expenseReducer from './slices/expensesSlices';
import reimbursementReducer from './slices/reimbursementSlices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    expenses: expenseReducer,
    reimbursement: reimbursementReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectAuth = (state: RootState) => state.auth;

export const selectUser = createSelector([selectAuth], (auth) =>
  auth.user ? { ...auth.user } : null
);

export const selectUserDetails = createSelector([selectUser], (user) =>
  user
    ? {
        isActive: !!user,
        userId: user.id,
        userName: user.name,
      }
    : null
);

export const selectIsAuthenticated = createSelector([selectAuth], (auth) => auth.isAuthenticated);
