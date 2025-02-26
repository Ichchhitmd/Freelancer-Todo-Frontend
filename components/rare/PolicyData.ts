import { PolicyData } from 'types/policyTypes';

export const dummyPolicyData: { [key: string]: PolicyData } = {
  privacyPolicy: {
    id: 'privacy-policy-v1',
    title: 'Privacy Policy',
    lastUpdated: 'February 25, 2025',
    sections: [
      {
        id: 'privacy-intro',
        heading: 'Introduction',
        content:
          'Welcome to our Privacy Policy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this Privacy Policy carefully. By accessing or using the application, you agree to the terms of this Privacy Policy.',
      },
      {
        id: 'privacy-collection',
        heading: 'Information We Collect',
        content:
          'We may collect information about you in various ways. The information we may collect includes:\n\n• Personal Data: Name, email address, phone number, and location data\n• Usage Data: Information on how you use the application\n• Device Data: Information about your mobile device including device type, operating system, and unique device identifiers',
      },
      {
        id: 'privacy-usage',
        heading: 'How We Use Your Information',
        content:
          'We may use the information we collect about you to:\n\n• Create and manage your account\n• Provide and maintain our service\n• Notify you about changes to our service\n• Allow you to participate in interactive features\n• Provide customer support\n• Monitor usage of our application',
      },
      {
        id: 'privacy-disclosure',
        heading: 'Disclosure of Your Information',
        content:
          'We may share information we have collected about you in certain situations. Your information may be disclosed as follows:\n\n• By Law or to Protect Rights: If we believe the release of information is necessary to protect our rights, comply with a judicial proceeding, court order, or legal process\n• Third-Party Service Providers: We may share your information with third-party service providers to help us operate our business and our application',
      },
      {
        id: 'privacy-security',
        heading: 'Security of Your Information',
        content:
          'We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that no security measures are perfect or impenetrable, and no data transmission over the Internet can be guaranteed to be 100% secure.',
      },
      {
        id: 'privacy-contact',
        heading: 'Contact Us',
        content:
          'If you have questions or concerns about this Privacy Policy, please contact us at privacy@example.com.',
      },
    ],
  },
  termsOfService: {
    id: 'terms-of-service-v1',
    title: 'Terms of Service',
    lastUpdated: 'February 25, 2025',
    sections: [
      {
        id: 'terms-agreement',
        heading: 'Agreement to Terms',
        content:
          'By accessing our application, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws.',
      },
      {
        id: 'terms-representations',
        heading: 'User Representations',
        content:
          'By using the application, you represent and warrant that:\n\n• You have the legal capacity to accept these Terms\n• You are not a minor in the jurisdiction in which you reside\n• You will not access the application through automated or non-human means\n• You will not use the application for any illegal or unauthorized purpose',
      },
      {
        id: 'terms-prohibited',
        heading: 'Prohibited Activities',
        content:
          'You may not access or use the application for any purpose other than that for which we make it available. As a user of the application, you agree not to:\n\n• Trick, defraud, or mislead other users\n• Attempt to bypass any measures of the application designed to prevent or restrict access\n• Use any information obtained from the application to harass, abuse, or harm another person',
      },
      {
        id: 'terms-license',
        heading: 'Mobile Application License',
        content:
          'If you access the application via a mobile application, we grant you a limited, non-exclusive, non-transferable, revocable license to use the application strictly in accordance with these terms.',
      },
      {
        id: 'terms-liability',
        heading: 'Limitation of Liability',
        content:
          'In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the application.',
      },
      {
        id: 'terms-termination',
        heading: 'Term and Termination',
        content:
          'These Terms shall remain in full force and effect while you use the application. We may terminate or suspend your account immediately, without prior notice, if you violate any provision of these Terms.',
      },
    ],
  },
};
