export interface Reimbursement {
    id: number;
    eventId: number;
    type: string;
    amount: number;
    description: string;
    image: string | null;
}

export interface CreateReimbursement {
    eventId: number;
    type: string;
    amount: number;
    description: string;
    image: string | null;
}

export interface ReimbursementResponse {
    id: number;
    eventId: number;
    type: string;
    amount: number;
    description: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
}