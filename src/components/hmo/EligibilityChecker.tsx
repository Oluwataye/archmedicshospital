import React, { useState } from 'react';
import { EligibilityCheckResult } from '@/types/hmo';
import HMOService from '@/services/hmoService';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

interface EligibilityCheckerProps {
    patientId: string;
    onEligibilityChecked?: (result: EligibilityCheckResult) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
    patientId,
    onEligibilityChecked,
}) => {
    const [checking, setChecking] = useState(false);
    const [result, setResult] = useState<EligibilityCheckResult | null>(null);

    const checkEligibility = async () => {
        try {
            setChecking(true);
            const eligibility = await HMOService.verifyEligibility(patientId);
            setResult(eligibility);

            if (onEligibilityChecked) {
                onEligibilityChecked(eligibility);
            }

            if (eligibility.is_eligible) {
                toast.success('Patient is eligible for HMO services');
            } else {
                toast.warning(eligibility.message);
            }
        } catch (error) {
            console.error('Error checking eligibility:', error);
            toast.error('Failed to check eligibility');
        } finally {
            setChecking(false);
        }
    };

    const getStatusIcon = () => {
        if (!result) return null;

        if (result.is_eligible) {
            return <CheckCircle className="w-6 h-6 text-green-500" />;
        } else if (result.policy_status === 'expired') {
            return <XCircle className="w-6 h-6 text-red-500" />;
        } else {
            return <AlertCircle className="w-6 h-6 text-yellow-500" />;
        }
    };

    const getStatusColor = () => {
        if (!result) return 'gray';

        if (result.is_eligible) return 'green';
        if (result.policy_status === 'expired') return 'red';
        return 'yellow';
    };

    return (
        <div className="space-y-4">
            {/* Check Button */}
            <button
                onClick={checkEligibility}
                disabled={checking || !patientId}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                {checking ? (
                    <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Checking Eligibility...</span>
                    </>
                ) : (
                    <span>Check HMO Eligibility</span>
                )}
            </button>

            {/* Results */}
            {result && (
                <div
                    className={`p-4 rounded-lg border-2 ${result.is_eligible
                            ? 'bg-green-50 border-green-200'
                            : result.policy_status === 'expired'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-yellow-50 border-yellow-200'
                        }`}
                >
                    {/* Status Header */}
                    <div className="flex items-center space-x-3 mb-4">
                        {getStatusIcon()}
                        <div>
                            <h3 className="font-semibold text-lg">
                                {result.is_eligible ? 'Eligible' : 'Not Eligible'}
                            </h3>
                            <p className="text-sm text-gray-600">{result.message}</p>
                        </div>
                    </div>

                    {/* HMO Details */}
                    {result.hmo_provider && (
                        <div className="space-y-3">
                            <div className="border-t pt-3">
                                <h4 className="font-medium text-gray-900 mb-2">HMO Provider</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Name:</span>
                                        <span className="ml-2 font-medium">{result.hmo_provider.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Code:</span>
                                        <span className="ml-2 font-medium">{result.hmo_provider.code}</span>
                                    </div>
                                    {result.hmo_provider.contact_phone && (
                                        <div>
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="ml-2 font-medium">
                                                {result.hmo_provider.contact_phone}
                                            </span>
                                        </div>
                                    )}
                                    {result.hmo_provider.contact_email && (
                                        <div>
                                            <span className="text-gray-600">Email:</span>
                                            <span className="ml-2 font-medium">
                                                {result.hmo_provider.contact_email}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Package Details */}
                            {result.package && (
                                <div className="border-t pt-3">
                                    <h4 className="font-medium text-gray-900 mb-2">Coverage Package</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">Package:</span>
                                            <span className="ml-2 font-medium">{result.package.package_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Annual Limit:</span>
                                            <span className="ml-2 font-medium">
                                                ₦{result.package.annual_limit?.toLocaleString()}
                                            </span>
                                        </div>
                                        {result.package.copay_percentage && (
                                            <div>
                                                <span className="text-gray-600">Co-pay:</span>
                                                <span className="ml-2 font-medium">
                                                    {result.package.copay_percentage}%
                                                </span>
                                            </div>
                                        )}
                                        {result.coverage_remaining !== undefined && (
                                            <div>
                                                <span className="text-gray-600">Remaining:</span>
                                                <span className="ml-2 font-medium">
                                                    ₦{result.coverage_remaining.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Policy Status */}
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Policy Status:</span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${result.policy_status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : result.policy_status === 'expired'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {result.policy_status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Not Enrolled Message */}
                    {result.policy_status === 'not_enrolled' && (
                        <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <p className="text-sm text-gray-700">
                                This patient is not currently enrolled in any HMO plan. Please enroll the
                                patient before proceeding with HMO services.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EligibilityChecker;
