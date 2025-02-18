import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, AuthResponse } from 'types/authTypes';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token.access_token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updatePhoto: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.photo = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, loginSuccess, updateUser, updatePhoto, logout } =
  authSlice.actions;

export default authSlice.reducer;
