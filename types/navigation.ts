import { EventDetails } from './eventTypes';

// types/navigation.ts
export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  MainTabs: undefined;
  'Add Work': {
    isEditMode: boolean;
    details: EventDetails;
  };
  EarningDetailScreen: {
    earnings: {
      totalEarnings: number;
      totalExpenses: number;
      netEarnings: number;
      eventCount: number;
      earningsByCompany: Array<{
        companyId: number;
        companyName: string;
        amount: number;
        expenses: number;
      }>;
    };
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
