
import { useState, useEffect } from 'react';
import { Search, AlertTriangle, AlertOctagon, Info, Check, X, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function AlertsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [alertTypeFilter, setAlertTypeFilter] = useState('All');

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getRecentDrugInteractionAlerts();

      // Parse and flatten data
      const parsedAlerts: any[] = [];

      data.forEach((check: any) => {
        const patientName = check.patient_first_name
          ? `${check.patient_first_name} ${check.patient_last_name} (${check.patient_mrn})`
          : `Patient ID: ${check.patient_id}`;

        const meds = JSON.parse(check.medications_checked || '[]');

        // Process Interactions
        const interactions = JSON.parse(check.interactions_found || '[]');
        interactions.forEach((item: any, idx: number) => {
          parsedAlerts.push({
            id: `${check.id}-int-${idx}`,
            type: 'Drug Interaction',
            severity: item.severity,
            title: `${item.drug_a} + ${item.drug_b}`,
            description: item.description,
            patients: [patientName],
            medications: meds,
            dateDetected: check.checked_at,
            resolved: check.action_taken !== 'Flagged' // Simple logic for now
          });
        });

        // Process Contraindications
        const contraindications = JSON.parse(check.contraindications_found || '[]');
        contraindications.forEach((item: any, idx: number) => {
          parsedAlerts.push({
            id: `${check.id}-con-${idx}`,
            type: 'Contraindication',
            severity: item.severity === 'Absolute' ? 'Critical' : 'High',
            title: `Contraindication: ${item.drug_name}`,
            description: item.description,
            patients: [patientName],
            medications: [item.drug_name],
            dateDetected: check.checked_at,
            resolved: check.action_taken !== 'Flagged'
          });
        });

        // Process Allergies
        const allergies = JSON.parse(check.allergy_alerts || '[]');
        allergies.forEach((item: any, idx: number) => {
          parsedAlerts.push({
            id: `${check.id}-alg-${idx}`,
            type: 'Allergy',
            severity: item.cross_sensitivity === 'High' ? 'Critical' : 'Major',
            title: `Allergy: ${item.drug_name}`,
            description: item.description,
            patients: [patientName],
            medications: [item.drug_name],
            dateDetected: check.checked_at,
            resolved: check.action_taken !== 'Flagged'
          });
        });
      });

      setAlerts(parsedAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Searching alerts",
      description: `Query: ${searchQuery}`,
    });
  };

  const resolveAlert = (id: string) => {
    toast({
      title: "Alert Resolved",
      description: `Alert ${id} has been marked as resolved`,
      variant: "default",
    });
  };

  const dismissAlert = (id: string) => {
    toast({
      title: "Alert Dismissed",
      description: `Alert ${id} has been dismissed`,
      variant: "default",
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertOctagon size={16} className="text-red-500 mr-2" />;
      case 'High':
        return <AlertTriangle size={16} className="text-orange-500 mr-2" />;
      case 'Medium':
        return <AlertTriangle size={16} className="text-yellow-500 mr-2" />;
      case 'Low':
        return <Info size={16} className="text-blue-500 mr-2" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    // Filter by type
    if (alertTypeFilter !== 'All' && alert.type !== alertTypeFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        alert.id.toLowerCase().includes(query) ||
        alert.patients.some(patient => patient.toLowerCase().includes(query)) ||
        alert.medications.some(med => med.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const activeAlerts = filteredAlerts.filter(alert => !alert.resolved);
  const resolvedAlerts = filteredAlerts.filter(alert => alert.resolved);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Interactions & Alerts</h1>
        <p className="text-gray-600">Manage medication interactions, allergies, and other clinical alerts</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Search & Filter Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white"
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Alert Type:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    {alertTypeFilter} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setAlertTypeFilter('All')}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setAlertTypeFilter('Drug Interaction')}>
                    Drug Interaction
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAlertTypeFilter('Allergy')}>
                    Allergy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAlertTypeFilter('Dosage')}>
                    Dosage
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAlertTypeFilter('Duplicate Therapy')}>
                    Duplicate Therapy
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="active" className="text-center py-2">
            Active Alerts ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="text-center py-2">
            Resolved Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check size={64} className="text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">No Active Alerts</h3>
                <p className="text-gray-500">There are no active alerts matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="overflow-hidden">
                  <div className={`px-6 py-4 flex justify-between items-center border-b ${alert.severity === 'Critical' ? 'bg-red-50' : alert.severity === 'High' ? 'bg-orange-50' : alert.severity === 'Medium' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                    <div className="flex items-center">
                      {getSeverityIcon(alert.severity)}
                      <span className="font-semibold">{alert.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                        {alert.severity} {alert.type}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(alert.dateDetected)}</span>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Description</h4>
                      <p className="text-gray-600">{alert.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-700">Affected Patients</h4>
                        <ul className="list-disc pl-5 text-gray-600">
                          {alert.patients.map((patient, index) => (
                            <li key={index}>{patient}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Medications</h4>
                        <ul className="list-disc pl-5 text-gray-600">
                          {alert.medications.map((med, index) => (
                            <li key={index}>{med}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        className="flex items-center"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="mr-1 h-4 w-4" /> Dismiss
                      </Button>
                      <Button
                        className="flex items-center"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <Check className="mr-1 h-4 w-4" /> Resolve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved">
          {resolvedAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Info size={64} className="text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">No Resolved Alerts</h3>
                <p className="text-gray-500">There are no resolved alerts matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {resolvedAlerts.map((alert) => (
                <Card key={alert.id} className="overflow-hidden opacity-75">
                  <div className="px-6 py-4 flex justify-between items-center border-b">
                    <div className="flex items-center">
                      {getSeverityIcon(alert.severity)}
                      <span className="font-semibold">{alert.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                        {alert.severity} {alert.type}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Resolved</span>
                      <span className="text-xs text-gray-500">{formatDate(alert.dateDetected)}</span>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Description</h4>
                      <p className="text-gray-600">{alert.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700">Affected Patients</h4>
                        <ul className="list-disc pl-5 text-gray-600">
                          {alert.patients.map((patient, index) => (
                            <li key={index}>{patient}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Medications</h4>
                        <ul className="list-disc pl-5 text-gray-600">
                          {alert.medications.map((med, index) => (
                            <li key={index}>{med}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
