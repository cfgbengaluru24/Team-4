import React from 'react';
import { useLocation } from 'react-router-dom';

const CertificatePage = () => {
  const location = useLocation();
  const certificateUrl = location.state?.certificateUrl;

  if (!certificateUrl) {
    return <div>Certificate URL not provided</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Your Certificate</h1>
        <div className="flex justify-center">
          <img src={certificateUrl} alt="Certificate" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
