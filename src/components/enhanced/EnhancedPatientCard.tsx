import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Wind
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: string;
  lastVisit: string;
  records: number;
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
  };
}

interface EnhancedPatientCardProps {
  patient: Patient;
  onViewChart?: () => void;
  onNewRecord?: () => void;
}

export function EnhancedPatientCard({ patient, onViewChart, onNewRecord }: EnhancedPatientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200'
      case 'Follow-up': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'New': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Discharged': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getVitalStatus = (vital: number | string, type: string) => {
    if (type === 'bloodPressure') {
      const [systolic] = String(vital).split('/').map(Number)
      return systolic > 130 ? 'text-red-600' : 'text-green-600'
    }
    if (type === 'heartRate') {
      const hr = Number(vital)
      return hr > 100 || hr < 60 ? 'text-red-600' : 'text-green-600'
    }
    if (type === 'temperature') {
      const temp = Number(vital)
      return temp > 99.5 ? 'text-red-600' : 'text-green-600'
    }
    if (type === 'oxygenSat') {
      const o2 = Number(vital)
      return o2 < 95 ? 'text-red-600' : 'text-green-600'
    }
    return 'text-gray-600'
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {patient.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              MRN: {patient.id} | {patient.age} years, {patient.gender}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(patient.status)} font-medium border`}>
            {patient.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 font-medium">Last visit:</span>
            <p className="font-semibold text-gray-900">{patient.lastVisit}</p>
          </div>
          <div>
            <span className="text-gray-500 font-medium">Records:</span>
            <p className="font-semibold text-gray-900">{patient.records} Records</p>
          </div>
        </div>
        
        {/* Enhanced Vital Signs Display */}
        {patient.vitals && (
          <div className="border-t pt-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-blue-600" />
              Latest Vitals
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <Heart className="w-3 h-3 text-red-500 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-gray-500">BP:</span>
                  <span className={`ml-1 font-semibold ${getVitalStatus(patient.vitals.bloodPressure, 'bloodPressure')}`}>
                    {patient.vitals.bloodPressure} mmHg
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Activity className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-gray-500">HR:</span>
                  <span className={`ml-1 font-semibold ${getVitalStatus(patient.vitals.heartRate, 'heartRate')}`}>
                    {patient.vitals.heartRate} bpm
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Thermometer className="w-3 h-3 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-gray-500">Temp:</span>
                  <span className={`ml-1 font-semibold ${getVitalStatus(patient.vitals.temperature, 'temperature')}`}>
                    {patient.vitals.temperature}°F
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Wind className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-gray-500">O2:</span>
                  <span className={`ml-1 font-semibold ${getVitalStatus(patient.vitals.oxygenSat, 'oxygenSat')}`}>
                    {patient.vitals.oxygenSat}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 hover:bg-gray-50"
            onClick={onViewChart}
          >
            View Chart
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={onNewRecord}
          >
            New Record
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EnhancedPatientCard;
