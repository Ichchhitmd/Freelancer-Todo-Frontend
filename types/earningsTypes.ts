export interface EarningsSummary {
  totalEvents: number;
  totalQuotedEarnings: string;
  totalReceivedEarnings: number;
  totalDueAmount: number;
}

interface MonthlyYearlyEarnings {
  quotedEarnings: number;
  receivedEarnings: number;
  dueAmount: number;
  eventCount: number;
  nepaliDate: {
    nepaliYear: number;
    nepaliMonth: number;
  };
}

export interface DetailNepaliDate {
  nepaliDay: number;
  nepaliYear: number;
  nepaliMonth: number;
}

export interface Event {
  id: number;
  eventDate: string[];
  nepaliEventDate: string[];
  detailNepaliDate: DetailNepaliDate[];
  eventType: string;
  earnings: string;
  actualEarnings: string | null;
  dueAmount: number;
}

export interface DataSummary {
  total: EarningsSummary;
  monthly: Record<string, MonthlyYearlyEarnings>;
  yearly: Record<string, MonthlyYearlyEarnings>;
  events: Event[];
}
