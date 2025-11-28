
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ResultsPage = () => {
  const navigate = useNavigate();

  // Select the "Pending" tab by default
  return (
    <div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Results</div>
      
      {/* Page Header with Date */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Test Results Management</h1>
      </div>
      
      {/* Results Tabs */}
      <Card className="border border-gray-200 mb-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="pending" onClick={() => navigate('/lab/results/pending')}>
              Pending Results
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => navigate('/lab/results/completed')}>
              Completed Results
            </TabsTrigger>
            <TabsTrigger value="critical" onClick={() => navigate('/lab/results/critical')}>
              Critical Results
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">Pending Results</h3>
              <p className="text-gray-500 mt-2">Redirecting to pending results...</p>
              <Button 
                className="mt-4"
                style={{ backgroundColor: '#3B82F6' }}
                onClick={() => navigate('/lab/results/pending')}
              >
                View Pending Results
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">Completed Results</h3>
              <p className="text-gray-500 mt-2">Redirecting to completed results...</p>
              <Button 
                className="mt-4"
                style={{ backgroundColor: '#3B82F6' }}
                onClick={() => navigate('/lab/results/completed')}
              >
                View Completed Results
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="critical">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">Critical Results</h3>
              <p className="text-gray-500 mt-2">Redirecting to critical results...</p>
              <Button 
                className="mt-4"
                style={{ backgroundColor: '#3B82F6' }}
                onClick={() => navigate('/lab/results/critical')}
              >
                View Critical Results
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Informational Card */}
      <Card className="border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Results Management</h2>
        <p className="text-gray-600 mb-4">
          Manage test results through the tabs above. View pending results that need to be processed, 
          review completed results, or address critical results that require immediate attention.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Pending Results</h3>
            <p className="text-sm text-yellow-700">
              Tests that have been processed but results are not yet verified.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-medium text-green-800 mb-2">Completed Results</h3>
            <p className="text-sm text-green-700">
              Tests with verified results ready for physician review.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h3 className="font-medium text-red-800 mb-2">Critical Results</h3>
            <p className="text-sm text-red-700">
              Results requiring immediate clinical attention or intervention.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsPage;
