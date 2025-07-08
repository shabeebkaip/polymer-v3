"use client";

import React from 'react';

interface QuoteRequestDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const QuoteRequestDetailPage = ({ params }: QuoteRequestDetailPageProps) => {
  const [id, setId] = React.useState<string>('');

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quote Request Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Quote request ID: {id}</p>
        <p className="text-gray-600">Quote request details coming soon...</p>
      </div>
    </div>
  );
};

export default QuoteRequestDetailPage;