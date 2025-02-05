import { get, post, put, del } from "./api";
import { GadgetResponse } from "types/gadgetTypes";
import { store } from "redux/store";

export const getGadgets = async () => {
    const token = store.getState().auth.token;
    if (!token) {
        throw new Error('No authentication token available');
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
        throw new Error('No authentication token available');
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
        throw new Error('No authentication token available');
    }
    return put<GadgetResponse>(`/gadgets/${id}`, data , {
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
}

export const deleteGadget = async (id: number) => {
    const token = store.getState().auth.token;
    if (!token) {
        throw new Error('No authentication token available');
    }
    return del(`/gadgets/${id}`, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
}