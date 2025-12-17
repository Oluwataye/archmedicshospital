import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock } from 'lucide-react';
import { usePendingLabOrders } from '@/hooks/useLabHooks';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const PendingResultsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { orders, loading } = usePendingLabOrders();
  const navigate = useNavigate();

  const filteredOrders = orders.filter(order => {
    const searchMatch = searchQuery === '' ||
      String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.patient_first_name} ${order.patient_last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.patient_mrn?.toLowerCase().includes(searchQuery.toLowerCase());

    return searchMatch;
  });

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading pending orders..." />;
  }

  return (
    <div className="p-6">
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Pending Results</div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pending Lab Orders</h1>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-600">{filteredOrders.length} Pending Orders</span>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by patient name, MRN, test ID or type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Pending Orders Table */}
      <Card className="border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordered By
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>No pending orders at this time</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.patient_first_name} {order.patient_last_name}
                      <br />
                      <span className="text-xs text-gray-400">{order.patient_mrn}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.test_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Dr. {order.orderer_first_name} {order.orderer_last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order.order_date), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Routine
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => navigate(`/lab/results/entry?order=${order.id}`)}
                        >
                          Process
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredOrders.length}</span> of{' '}
              <span className="font-medium">{filteredOrders.length}</span> results
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="default" size="sm" className="bg-blue-500">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PendingResultsPage;
