import { post } from './api';
import { CreateExpense } from 'types/expensesTypes';

export const postExpense = async (expenseData: CreateExpense): Promise<any> => {
    return post<any>('/company-expenses', expenseData);
}