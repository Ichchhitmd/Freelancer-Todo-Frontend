import { post } from './api';
import { ReimbursementResponse } from 'types/reimburesmentTypes';

export const postReimbursement = async (formData: FormData): Promise<ReimbursementResponse> => {
    return post<ReimbursementResponse>('/event-expenses', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}