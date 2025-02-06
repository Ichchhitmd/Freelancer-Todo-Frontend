import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices';
import gadgetReducer from './slices/gadgetSlices';
import companyReducer from './slices/companySlices';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gadgets: gadgetReducer,
    company: companyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
