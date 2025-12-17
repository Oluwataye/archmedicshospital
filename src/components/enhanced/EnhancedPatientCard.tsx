import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  AlertTriangle
} from 'lucide-react';
import { getBPStatus, getHRStatus, getTempStatus, getO2Status, getVitalTextColor } from '@/utils/vitalSignsUtils';
import { cn } from '@/lib/utils';

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

  // Calculate vital statuses
  const bpStatus = patient.vitals ? getBPStatus(patient.vitals.bloodPressure) : 'normal';
  const hrStatus = patient.vitals ? getHRStatus(patient.vitals.heartRate) : 'normal';
  const tempStatus = patient.vitals ? getTempStatus(patient.vitals.temperature) : 'normal';
  const o2Status = patient.vitals ? getO2Status(patient.vitals.oxygenSat) : 'normal';

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
                <div className="min-w-0 flex-1">
                  <span className="text-gray-500">BP:</span>
                  <span className={cn('ml-1 font-semibold', getVitalTextColor(bpStatus))}>
                    {patient.vitals.bloodPressure} mmHg
                  </span>
                  {(bpStatus === 'danger' || bpStatus === 'borderline') && (
                    <AlertTriangle className={cn('w-3 h-3 inline ml-1',
                      bpStatus === 'danger' ? 'text-red-600' : 'text-amber-600'
                    )} />
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Activity className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-gray-500">HR:</span>
                  <span className={cn('ml-1 font-semibold', getVitalTextColor(hrStatus))}>
                    {patient.vitals.heartRate} bpm
                  </span>
                  {(hrStatus === 'danger' || hrStatus === 'borderline') && (
                    <AlertTriangle className={cn('w-3 h-3 inline ml-1',
                      hrStatus === 'danger' ? 'text-red-600' : 'text-amber-600'
                    )} />
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Thermometer className="w-3 h-3 text-orange-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-gray-500">Temp:</span>
                  <span className={cn('ml-1 font-semibold', getVitalTextColor(tempStatus))}>
                    {patient.vitals.temperature}°F
                  </span>
                  {(tempStatus === 'danger' || tempStatus === 'borderline') && (
                    <AlertTriangle className={cn('w-3 h-3 inline ml-1',
                      tempStatus === 'danger' ? 'text-red-600' : 'text-amber-600'
                    )} />
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Wind className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-gray-500">O2:</span>
                  <span className={cn('ml-1 font-semibold', getVitalTextColor(o2Status))}>
                    {patient.vitals.oxygenSat}%
                  </span>
                  {(o2Status === 'danger' || o2Status === 'borderline') && (
                    <AlertTriangle className={cn('w-3 h-3 inline ml-1',
                      o2Status === 'danger' ? 'text-red-600' : 'text-amber-600'
                    )} />
                  )}
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
