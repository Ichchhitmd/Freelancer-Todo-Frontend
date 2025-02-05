import { GadgetResponse } from './gadgetTypes';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  MainTabs: undefined;
  DateDetails: {
    details: {
      date: string;
      details: any;
    };
  };
  EarningDetailScreen: {
    earnings: {
      totalEarnings: number;
      totalExpenses: number;
      netEarnings: number;
      eventCount: number;
      earningsByCompany: {
        companyId: number;
        companyName: string;
        amount: number;
        expenses: number;
      }[];
    };
  };
  AddGadget: undefined;
  EditGadget: {
    gadget: GadgetResponse;
  };
  GadgetDetails: {
    gadget: GadgetResponse;
  };
};
