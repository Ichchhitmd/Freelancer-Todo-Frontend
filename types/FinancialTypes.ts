export interface FinancialsResponse {
  totalEvents: number;
  totalEarnings: number;
  totalReceived: number;
  totalDue: number;
  advancePaymentBalance: number;
  paymentStatus: {
    paid: number;
    partiallyPaid: number;
    unpaid: number;
    advanceReceived: number;
  };
  events: {
    id: number;
    eventDate: string[];
    eventCategory: string;
    earnings: string;
    nepaliEventDate: string[];
    workType: string[];
    actualEarnings: string;
    dueAmount: number;
    paymentStatus: string;
  }[];
}
