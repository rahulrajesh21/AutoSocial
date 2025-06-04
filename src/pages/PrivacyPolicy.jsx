import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6 text-gray-200">
        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="mb-4">
          Welcome to AutoSocial. We respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
        <p className="mb-2">We collect several types of information from and about users of our platform, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1">Personal identifiers such as name and email address provided during account creation</li>
          <li className="mb-1">Authentication tokens for connected services like Instagram</li>
          <li className="mb-1">Content you create, upload, or generate using our platform</li>
          <li className="mb-1">Usage data and analytics about how you interact with our platform</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
        <p className="mb-2">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1">Provide, maintain, and improve our services</li>
          <li className="mb-1">Process and complete transactions</li>
          <li className="mb-1">Send you technical notices and updates</li>
          <li className="mb-1">Respond to your comments and questions</li>
          <li className="mb-1">Monitor and analyze trends and usage</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">4. Instagram Data</h2>
        <p className="mb-4">
          When you connect your Instagram account, we access only the data necessary to provide our services.
          This includes your basic profile information and the ability to post content on your behalf.
          We do not store your Instagram password, and we only use your data in accordance with Instagram's Platform Policy.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">5. Data Sharing and Disclosure</h2>
        <p className="mb-2">We may share your information with:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1">Service providers who perform services on our behalf</li>
          <li className="mb-1">Professional advisors such as lawyers, auditors, and insurers</li>
          <li className="mb-1">Government bodies when required by law</li>
        </ul>
        <p className="mb-4">
          We do not sell your personal information to third parties.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
        <p className="mb-2">Depending on your location, you may have certain rights regarding your personal data, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-1">The right to access your personal data</li>
          <li className="mb-1">The right to rectify inaccurate data</li>
          <li className="mb-1">The right to erasure of your data</li>
          <li className="mb-1">The right to restrict processing of your data</li>
          <li className="mb-1">The right to data portability</li>
        </ul>
        
        <h2 className="text-xl font-semibold mb-3">7. Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal data 
          against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">8. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
          and updating the "Last Updated" date.
        </p>
        
        <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          <a href="mailto:martianchronicles1990@gmail.com" className="text-blue-400 hover:underline">martianchronicles1990@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 