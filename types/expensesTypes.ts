export interface Expense {
    title: string;
    amount: string;
    description: string;
    screenshotUrl: null | string;
    companyId: number;
}

export interface CreateExpense {
    title: string;
    amount: string;
    description: string;
    screenshotUrl: null | string;
    companyId: number;
}

export interface ExpenseResponse {
    id: number;
    title: string;
    amount: string;
    description: string;
    screenshotUrl: null | string;
    companyId: number;
    createdAt: string;
    updatedAt: string;
}