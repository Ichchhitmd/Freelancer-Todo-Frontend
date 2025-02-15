import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';

export const selectUser = (state: RootState) => state.auth.user;

export const selectUserId = createSelector([selectUser], (user) => user?.id);
