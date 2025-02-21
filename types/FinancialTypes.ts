export interface FinancialsResponse {
  totalEvents: number;
  totalEarnings: number;
  totalReceived: number;
  totalDue: number;
  paymentStatus: {
    paid: number;
    partiallyPaid: number;
    unpaid: number;
  };
  events: {
    id: number;
    eventDate: string[];
    eventType: string;
    earnings: string;
    actualEarnings: string;
    dueAmount: number;
    paymentStatus: string;
  }[];
}
