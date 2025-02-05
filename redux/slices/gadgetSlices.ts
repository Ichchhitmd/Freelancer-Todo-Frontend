import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GadgetResponse } from 'types/gadgetTypes';
import { getGadgets, createGadget, updateGadget, deleteGadget, CreateGadgetData } from 'helper/gadgetRequest';

interface GadgetState {
    gadgets: GadgetResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: GadgetState = {
    gadgets: [],
    loading: false,
    error: null,
};

// Fetch all gadgets
export const fetchGadgets = createAsyncThunk(
    'gadgets/fetchGadgets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getGadgets();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Create a new gadget
export const addGadget = createAsyncThunk(
    'gadgets/addGadget',
    async (data: CreateGadgetData, { rejectWithValue }) => {
        try {
            const response = await createGadget(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Update an existing gadget
export const editGadget = createAsyncThunk(
    'gadgets/editGadget',
    async ({ id, data }: { id: number; data: Partial<CreateGadgetData> }, { rejectWithValue }) => {
        try {
            const response = await updateGadget(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete a gadget
export const removeGadget = createAsyncThunk(
    'gadgets/removeGadget',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteGadget(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const gadgetSlice = createSlice({
    name: 'gadgets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch gadgets cases
            .addCase(fetchGadgets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGadgets.fulfilled, (state, action: PayloadAction<GadgetResponse[]>) => {
                state.loading = false;
                state.gadgets = action.payload;
            })
            .addCase(fetchGadgets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add gadget cases
            .addCase(addGadget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addGadget.fulfilled, (state, action: PayloadAction<GadgetResponse>) => {
                state.loading = false;
                state.gadgets.push(action.payload);
            })
            .addCase(addGadget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Edit gadget cases
            .addCase(editGadget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editGadget.fulfilled, (state, action: PayloadAction<GadgetResponse>) => {
                state.loading = false;
                const index = state.gadgets.findIndex(g => g.id === action.payload.id);
                if (index !== -1) {
                    state.gadgets[index] = action.payload;
                }
            })
            .addCase(editGadget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Remove gadget cases
            .addCase(removeGadget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeGadget.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.gadgets = state.gadgets.filter(g => g.id !== action.payload);
            })
            .addCase(removeGadget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default gadgetSlice.reducer;