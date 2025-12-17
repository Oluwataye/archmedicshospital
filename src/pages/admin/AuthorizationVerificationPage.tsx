import React, { useState } from 'react';
import { Search, Shield, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PreAuthService, { PatientSearchResult, AuthCodeValidationResult } from '@/services/preauthService';

export default function AuthorizationVerificationPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
    const [authCode, setAuthCode] = useState('');
    const [validationResult, setValidationResult] = useState<AuthCodeValidationResult | null>(null);
    const [serviceCategory, setServiceCategory] = useState<'primary' | 'secondary' | 'tertiary'>('primary');
    const [notes, setNotes] = useState('');
    const [searching, setSearching] = useState(false);
    const [validating, setValidating] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            toast.error('Please enter a search query');
            return;
        }

        setSearching(true);
        try {
            const results = await PreAuthService.searchPatientForAuth(searchQuery);
            setSearchResults(results);
            if (results.length === 0) {
                toast.info('No patients found');
            }
        } catch (error: any) {
            console.error('Search error:', error);
            toast.error('Failed to search patients');
        } finally {
            setSearching(false);
        }
    };

    const handleSelectPatient = (patient: PatientSearchResult) => {
        setSelectedPatient(patient);
        setSearchResults([]);
        setSearchQuery('');
        setAuthCode('');
        setValidationResult(null);
        toast.success(`Selected: ${patient.first_name} ${patient.last_name}`);
    };

    const handleCodeChange = async (code: string) => {
        setAuthCode(code);
        setValidationResult(null);

        if (code.length >= 8 && selectedPatient) {
            setValidating(true);
            try {
                const result = await PreAuthService.validateAuthCode(code, selectedPatient.id);
                setValidationResult(result);
            } catch (error) {
                console.error('Validation error:', error);
            } finally {
                setValidating(false);
            }
        }
    };

    const handleVerify = async () => {
        if (!selectedPatient) {
            toast.error('Please select a patient');
            return;
        }

        if (!authCode.trim()) {
            toast.error('Please enter an authorization code');
            return;
        }

        if (!validationResult?.valid) {
            toast.error('Please enter a valid authorization code');
            return;
        }

        setVerifying(true);
        try {
            const result = await PreAuthService.verifyAuthorizationCode({
                authorization_code: authCode,
                patient_id: selectedPatient.id,
                service_category: serviceCategory,
                notes: notes.trim() || undefined
            });

            toast.success(result.message);

            // Reset form
            setSelectedPatient(null);
            setAuthCode('');
            setValidationResult(null);
            setServiceCategory('primary');
            setNotes('');
        } catch (error: any) {
            console.error('Verification error:', error);
            toast.error(error.response?.data?.error || 'Failed to verify authorization');
        } finally {
            setVerifying(false);
        }
    };

    const getValidationIcon = () => {
        if (validating) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
        if (!validationResult) return null;

        if (validationResult.valid) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        } else {
            return <XCircle className="h-5 w-5 text-red-500" />;
        }
    };

    const getValidationMessage = () => {
        if (!validationResult) return null;

        const colorClass = validationResult.valid ? 'text-green-600' : 'text-red-600';
        return (
            <p className={`text-sm ${colorClass} mt-1`}>
                {validationResult.message}
            </p>
        );
    };

    return (
        <div className="flex-1 p-6 overflow-auto">
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">HMO Authorization Verification</h1>
                </div>
                <p className="text-muted-foreground">
                    Verify patient authorization codes from HMO/NHIS providers
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Patient Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Step 1: Search Patient</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search by MRN, Name, or Phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch} disabled={searching}>
                                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                                {searchResults.map((patient) => (
                                    <div
                                        key={patient.id}
                                        className="p-3 hover:bg-accent cursor-pointer transition-colors"
                                        onClick={() => handleSelectPatient(patient)}
                                    >
                                        <div className="font-medium">
                                            {patient.first_name} {patient.last_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            MRN: {patient.mrn} | {patient.gender} | {patient.phone}
                                        </div>
                                        {patient.hmo_provider_name && (
                                            <div className="text-sm text-blue-600 mt-1">
                                                HMO: {patient.hmo_provider_name} ({patient.hmo_package})
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Selected Patient */}
                        {selectedPatient && (
                            <div className="border-2 border-primary rounded-md p-4 bg-primary/5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-lg">Selected Patient</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedPatient(null);
                                            setAuthCode('');
                                            setValidationResult(null);
                                        }}
                                    >
                                        Change
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {selectedPatient.first_name} {selectedPatient.last_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        MRN: {selectedPatient.mrn}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        DOB: {new Date(selectedPatient.date_of_birth).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Gender: {selectedPatient.gender} | Phone: {selectedPatient.phone}
                                    </p>
                                    {selectedPatient.hmo_provider_name && (
                                        <div className="mt-2 pt-2 border-t">
                                            <p className="text-sm font-medium text-blue-600">
                                                HMO Provider: {selectedPatient.hmo_provider_name}
                                            </p>
                                            <p className="text-sm text-blue-600">
                                                Package: {selectedPatient.hmo_package?.toUpperCase()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right Column: Authorization Verification */}
                <Card>
                    <CardHeader>
                        <CardTitle>Step 2: Verify Authorization Code</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!selectedPatient ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Please select a patient first</p>
                            </div>
                        ) : (
                            <>
                                {/* Authorization Code Input */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Authorization Code *
                                    </label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter authorization code..."
                                            value={authCode}
                                            onChange={(e) => handleCodeChange(e.target.value.toUpperCase())}
                                            className="pr-10"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {getValidationIcon()}
                                        </div>
                                    </div>
                                    {getValidationMessage()}
                                </div>

                                {/* Service Category */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Service Category *
                                    </label>
                                    <select
                                        value={serviceCategory}
                                        onChange={(e) => setServiceCategory(e.target.value as any)}
                                        className="w-full border rounded-md px-3 py-2"
                                    >
                                        <option value="primary">Primary (Basic Outpatient)</option>
                                        <option value="secondary">Secondary (Specialist/Minor Procedures)</option>
                                        <option value="tertiary">Tertiary (Advanced/Surgeries)</option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Verification Notes (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add any notes about this verification..."
                                        className="w-full border rounded-md px-3 py-2 min-h-[80px]"
                                    />
                                </div>

                                {/* Authorization Details (if valid) */}
                                {validationResult?.valid && validationResult.preauth && (
                                    <div className="border border-green-200 bg-green-50 rounded-md p-4">
                                        <h4 className="font-semibold text-green-800 mb-2">Authorization Details</h4>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <span className="font-medium">HMO Provider:</span>{' '}
                                                {validationResult.preauth.hmo_provider_name}
                                            </p>
                                            <p>
                                                <span className="font-medium">Expiry Date:</span>{' '}
                                                {new Date(validationResult.preauth.expiry_date).toLocaleDateString()}
                                            </p>
                                            {validationResult.preauth.diagnosis && (
                                                <p>
                                                    <span className="font-medium">Diagnosis:</span>{' '}
                                                    {validationResult.preauth.diagnosis}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Verify Button */}
                                <Button
                                    onClick={handleVerify}
                                    disabled={!validationResult?.valid || verifying}
                                    className="w-full"
                                    size="lg"
                                >
                                    {verifying ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Verify Authorization
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Info Card */}
            <Card className="mt-6 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Important Notes:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Authorization codes are <strong>one-time use only</strong></li>
                                <li>Once verified, the code cannot be used again</li>
                                <li>All verifications are logged for audit purposes</li>
                                <li>Patients must have a valid authorization to access HMO services</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
