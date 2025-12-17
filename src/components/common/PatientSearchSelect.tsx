import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, User, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Patient } from '@/types/patient';

interface PatientSearchSelectProps {
    patients: Patient[];
    selectedPatientId: string;
    onSelectPatient: (patientId: string) => void;
    loading?: boolean;
}

const PatientSearchSelect: React.FC<PatientSearchSelectProps> = ({
    patients,
    selectedPatientId,
    onSelectPatient,
    loading = false,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Filter patients based on search query
    const filteredPatients = useMemo(() => {
        if (!searchQuery.trim()) {
            return patients;
        }

        const query = searchQuery.toLowerCase();
        return patients.filter(
            (patient) =>
                patient.first_name.toLowerCase().includes(query) ||
                patient.last_name.toLowerCase().includes(query) ||
                patient.mrn.toLowerCase().includes(query) ||
                patient.email?.toLowerCase().includes(query) ||
                patient.phone?.toLowerCase().includes(query)
        );
    }, [patients, searchQuery]);

    const selectedPatient = patients.find((p) => p.id === selectedPatientId);

    const handleSelectPatient = (patient: Patient) => {
        onSelectPatient(String(patient.id));
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const handleClearSelection = () => {
        onSelectPatient('');
        setSearchQuery('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Select Patient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search by name, MRN, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        className="pl-10 pr-10"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setIsSearchOpen(false);
                            }}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {isSearchOpen && searchQuery && (
                    <div className="absolute z-50 w-full max-w-2xl mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading patients...</div>
                        ) : filteredPatients.length > 0 ? (
                            <div className="py-2">
                                {filteredPatients.map((patient) => (
                                    <button
                                        key={patient.id}
                                        onClick={() => handleSelectPatient(patient)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-blue-500" />
                                                    <h4 className="font-semibold text-gray-900">
                                                        {patient.first_name} {patient.last_name}
                                                    </h4>
                                                </div>
                                                <div className="mt-1 space-y-1">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">MRN:</span> {patient.mrn}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">DOB:</span>{' '}
                                                        {format(parseISO(patient.date_of_birth), 'MMM dd, yyyy')}
                                                    </p>
                                                    {patient.phone && (
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Phone:</span> {patient.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                No patients found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}

                {/* Selected Patient Display */}
                {selectedPatient && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900 text-lg">
                                        {selectedPatient.first_name} {selectedPatient.last_name}
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-blue-700">
                                        <span className="font-medium">MRN:</span> {selectedPatient.mrn}
                                    </p>
                                    <p className="text-sm text-blue-700 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span className="font-medium">DOB:</span>{' '}
                                        {format(parseISO(selectedPatient.date_of_birth), 'MMM dd, yyyy')}
                                    </p>
                                    {selectedPatient.gender && (
                                        <p className="text-sm text-blue-700">
                                            <span className="font-medium">Gender:</span> {selectedPatient.gender}
                                        </p>
                                    )}
                                    {selectedPatient.phone && (
                                        <p className="text-sm text-blue-700">
                                            <span className="font-medium">Phone:</span> {selectedPatient.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearSelection}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Change
                            </Button>
                        </div>
                    </div>
                )}

                {/* No Selection State */}
                {!selectedPatient && !searchQuery && (
                    <div className="p-6 text-center border-2 border-dashed rounded-lg">
                        <Search className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-600 font-medium">No patient selected</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Search for a patient using the search box above
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PatientSearchSelect;
