import { useMutation } from '@tanstack/react-query';
import { postReimbursement } from 'helper/reimbursementRequests';

export const usePostReimbursement = () => {
    return useMutation({
        mutationFn: postReimbursement,
    });
}