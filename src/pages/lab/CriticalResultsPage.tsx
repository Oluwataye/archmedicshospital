import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, Mail } from 'lucide-react';
import { useCriticalLabResults } from '@/hooks/useLabHooks';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';
import { toast } from 'sonner';

const CriticalResultsPage = () => {
  const { results, loading } = useCriticalLabResults();

  const handleNotifyDoctor = (resultId: string, doctorName: string) => {
    toast.success(`Notification sent to ${doctorName}`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading critical results..." />;
  }

  return (
    <div className="p-6">
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Critical Results</div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Critical Results</h1>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-red-600">{results.length} Critical Results Pending Review</span>
        </div>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No critical results at this time</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {results.map((result) => (
            <Card key={result.id} className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {result.test_name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Patient: {result.patient_first_name} {result.patient_last_name} ({result.patient_mrn})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      CRITICAL
                    </span>
                    <span className="text-xs text-gray-500">
                      {result.result_date && format(new Date(result.result_date), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Test Type</p>
                    <p className="font-medium">{result.test_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ordered By</p>
                    <p className="font-medium">
                      Dr. {result.orderer_first_name} {result.orderer_last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Result Value</p>
                    <p className="font-medium text-red-600">{result.result_value || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{format(new Date(result.order_date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>

                {result.interpretation && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Interpretation</p>
                    <p className="text-sm text-yellow-700">{result.interpretation}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleNotifyDoctor(String(result.id), `${result.orderer_first_name} ${result.orderer_last_name}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Notify Doctor
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleNotifyDoctor(String(result.id), `${result.orderer_first_name} ${result.orderer_last_name}`)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button size="sm" variant="outline">
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CriticalResultsPage;
