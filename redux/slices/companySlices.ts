import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyResponse } from 'types/companiesTypes';

interface CompanyState {
    company: CompanyResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: CompanyState = {
    company: null,
    loading: false,
    error: null,
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setLoadingCompany(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setErrorCompany(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setCompany(state, action: PayloadAction<CompanyResponse>) {
            state.company = action.payload;
        }
    },
});

export const { setLoadingCompany, setErrorCompany, setCompany } = companySlice.actions;

export default companySlice.reducer;