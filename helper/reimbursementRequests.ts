import { post } from './api';
import { CreateReimbursement, ReimbursementResponse } from 'types/reimburesmentTypes';

export const postReimbursement = async (reimbursementData: CreateReimbursement): Promise<any> => {
    return post<any>('/event-expenses', reimbursementData);
}