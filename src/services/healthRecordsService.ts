
// Define types for health records
export interface HealthRecord {
  id: string;
  patientId: string;
  recordType: 'vital-signs' | 'procedures' | 'allergies' | 'history';
  date: Date;
  notes?: string;
  createdAt: Date;
  status: string;
  // Vital signs specific fields
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  oxygenSaturation?: string;
  // Procedure specific fields
  procedureName?: string;
  procedureLocation?: string;
  provider?: string;
  // Allergy specific fields
  allergen?: string;
  reaction?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  // Medical history specific fields
  condition?: string;
  diagnosisDate?: Date;
  treatment?: string;
}

// Simple in-memory storage for health records (in a real app, this would use an API or database)
let healthRecords: HealthRecord[] = [];

export const healthRecordsService = {
  // Get all records
  getAllRecords: (): HealthRecord[] => {
    return [...healthRecords];
  },
  
  // Get records by patient ID
  getRecordsByPatient: (patientId: string): HealthRecord[] => {
    return healthRecords.filter(record => record.patientId === patientId);
  },
  
  // Get records by type
  getRecordsByType: (patientId: string, type: string): HealthRecord[] => {
    return healthRecords.filter(
      record => record.patientId === patientId && record.recordType === type
    );
  },
  
  // Add a new record
  addRecord: (record: Partial<HealthRecord>): HealthRecord => {
    const newRecord = record as HealthRecord;
    healthRecords.push(newRecord);
    return newRecord;
  },
  
  // Update a record
  updateRecord: (recordId: string, updatedData: Partial<HealthRecord>): HealthRecord | null => {
    const index = healthRecords.findIndex(record => record.id === recordId);
    if (index !== -1) {
      healthRecords[index] = { ...healthRecords[index], ...updatedData };
      return healthRecords[index];
    }
    return null;
  },
  
  // Delete a record
  deleteRecord: (recordId: string): HealthRecord | null => {
    const index = healthRecords.findIndex(record => record.id === recordId);
    if (index !== -1) {
      const deletedRecord = healthRecords[index];
      healthRecords = healthRecords.filter(record => record.id !== recordId);
      return deletedRecord;
    }
    return null;
  }
};
