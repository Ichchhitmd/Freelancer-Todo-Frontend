export type PolicySection = {
  id: string;
  heading: string;
  content: string;
};

export type PolicyData = {
  id: string;
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
};

export type PolicyType = 'privacyPolicy' | 'termsOfService';
