// types/navigation.ts
export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  MainTabs: undefined;
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
