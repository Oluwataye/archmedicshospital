import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, CheckCircle, Clock, TestTube, ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLabStatistics, usePendingLabOrders, useCriticalLabResults } from '@/hooks/useLabHooks';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const LabDashboard = () => {
  const navigate = useNavigate();
  const { statistics, loading: statsLoading } = useLabStatistics();
  const { orders: pendingOrders, loading: pendingLoading } = usePendingLabOrders();
  const { results: criticalResults, loading: criticalLoading } = useCriticalLabResults();

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Laboratory Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Lab Technician</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/lab/inventory')} variant="outline" className="gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </Button>
          <Button onClick={() => navigate('/lab/worklist')} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <TestTube className="h-4 w-4" />
            Process Tests
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-blue"
          onClick={() => navigate('/lab/worklist')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tests Today</p>
              <h2 className="text-3xl font-bold text-blue-600">{statsLoading ? '-' : (statistics?.todayTests || 0)}</h2>
              <p className="text-xs text-muted-foreground mt-1">View details →</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TestTube className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-green"
          onClick={() => navigate('/lab/reports')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
              <h2 className="text-3xl font-bold text-green-600">{statsLoading ? '-' : (statistics?.completedToday || 0)}</h2>
              <p className="text-xs text-muted-foreground mt-1">View reports →</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-orange"
          onClick={() => navigate('/lab/worklist')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Tests</p>
              <h2 className="text-3xl font-bold text-yellow-600">{statsLoading ? '-' : (statistics?.pendingTests || 0)}</h2>
              <p className="text-xs text-muted-foreground mt-1">View worklist →</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-purple"
          onClick={() => navigate('/lab/reports?status=critical')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical Results</p>
              <h2 className="text-3xl font-bold text-red-600">{statsLoading ? '-' : (statistics?.criticalResults || 0)}</h2>
              <p className="text-xs text-muted-foreground mt-1">View alerts ↓</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pending Orders
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/lab/worklist')} className="text-indigo-600">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <div className="text-center py-8 text-gray-500">Loading pending orders...</div>
            ) : pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {pendingOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {order.patient_first_name?.[0]}{order.patient_last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.test_name}</p>
                        <p className="text-xs text-gray-500">
                          {order.patient_first_name} {order.patient_last_name} • {format(parseISO(order.order_date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                No pending orders
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Results */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Recent Critical Results
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/lab/reports?status=critical')} className="text-indigo-600">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {criticalLoading ? (
              <div className="text-center py-8 text-gray-500">Loading critical results...</div>
            ) : criticalResults.length > 0 ? (
              <div className="space-y-4">
                {criticalResults.slice(0, 5).map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                        !
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{result.test_name}</p>
                        <p className="text-xs text-gray-500">
                          {result.patient_first_name} {result.patient_last_name} • {result.result_value} {result.result_unit}
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                No critical results recently
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabDashboard;
