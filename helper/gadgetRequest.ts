import { get, post, put, del } from "./api";
import { GadgetResponse } from "types/gadgetTypes";
import { store} from "redux/store";

export const getGadgets = async () => {
    const token = store.getState().auth.token;
    if (!token) {
        throw new Error('Authentication required. Please log in again.');
    }

    return get<GadgetResponse[]>('/gadgets', {
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
}

export interface CreateGadgetData {
    name: string;
    model: string;
    purchaseDate: string;
    cost: number;
}

export const createGadget = async (data: CreateGadgetData) => {
    const token = store.getState().auth.token;
    if (!token) {
        throw new Error('Authentication required. Please log in again.');
    }
    return post<GadgetResponse>('/gadgets', data, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
}

export const updateGadget = async (id: number, data: Partial<CreateGadgetData>) => {
    const token = store.getState().auth.token;
    if (!token) {
        throw new Error('Authentication required. Please log in again.');
    }

    console.log('Update Gadget Request:', {
        id,
        data,
        token: token ? 'Present' : 'Missing',
        url: `/gadgets/${id}`
    });

    try {
        // Ensure all required fields are present
        if (!data.name || !data.model || !data.cost || !data.purchaseDate) {
            throw new Error('Missing required fields');
        }

        // Validate data types
        if (typeof data.cost !== 'number' || data.cost <= 0) {
            throw new Error('Invalid cost value');
        }

        if (!Date.parse(data.purchaseDate)) {
            throw new Error('Invalid purchase date');
        }

        const response = await put<GadgetResponse>(`/gadgets/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Update Gadget Response:', {
            status: 'success',
            data: response
        });
        return response;
    } catch (error: any) {
        console.error('Update Gadget Error:', {
            status: error?.response?.status,
            data: error?.response?.data,
            message: error?.message,
            stack: error?.stack
        });

        // Enhance error message based on the error type
        if (error.response?.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (error.response?.status === 404) {
            throw new Error('Gadget not found.');
        } else if (error.response?.status === 400) {
            throw new Error('Invalid data provided: ' + (error.response.data?.message || 'Please check your input.'));
        } else if (!error.response) {
            throw new Error('Network error. Please check your connection.');
        }
        
        throw error;
    }
}

export const deleteGadget = async (id: number) => {
    const token = store.getState().auth.token;
    if (!token) {
        throw new Error('Authentication required. Please log in again.');
    }
    return del(`/gadgets/${id}`, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
}