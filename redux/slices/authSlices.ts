import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from 'types/authTypes';

const initialState: UserState = {
  id: null,
  name: '',
  email: '',
  phone: '',
  location: '',
  isActive: false,
  experience: '',
  role: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    logout: () => initialState,
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
