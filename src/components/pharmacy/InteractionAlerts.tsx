import React from 'react';
import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DrugInteraction {
    id: string;
    drug_a: string;
    drug_b: string;
    severity: 'Critical' | 'Major' | 'Moderate' | 'Minor';
    description: string;
    clinical_effects?: string;
    management_recommendation?: string;
    evidence_level?: string;
}

interface DrugContraindication {
    id: string;
    drug_name: string;
    condition: string;
    severity: 'Absolute' | 'Relative';
    description: string;
    alternative_recommendations?: string;
}

interface AllergyInteraction {
    id: string;
    allergen: string;
    drug_name: string;
    cross_sensitivity: 'High' | 'Moderate' | 'Low';
    description: string;
    precautions?: string;
}

interface InteractionCheckResult {
    interactions: DrugInteraction[];
    contraindications: DrugContraindication[];
    allergyAlerts: AllergyInteraction[];
    hasCriticalIssues: boolean;
    hasMajorIssues: boolean;
}

interface InteractionAlertsProps {
    result: InteractionCheckResult;
    showDetails?: boolean;
}

export default function InteractionAlerts({ result, showDetails = true }: InteractionAlertsProps) {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical':
            case 'Absolute':
            case 'High':
                return 'destructive';
            case 'Major':
            case 'Relative':
            case 'Moderate':
                return 'default';
            case 'Low':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'Critical':
            case 'Absolute':
            case 'High':
                return <XCircle className="h-5 w-5" />;
            case 'Major':
            case 'Relative':
            case 'Moderate':
                return <AlertTriangle className="h-5 w-5" />;
            default:
                return <AlertCircle className="h-5 w-5" />;
        }
    };

    const hasAnyIssues = result.interactions.length > 0 ||
        result.contraindications.length > 0 ||
        result.allergyAlerts.length > 0;

    if (!hasAnyIssues) {
        return (
            <Alert className="border-green-200 bg-green-50">
                <Info className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">No Interactions Found</AlertTitle>
                <AlertDescription className="text-green-700">
                    No drug interactions, contraindications, or allergy alerts detected.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Alert */}
            {result.hasCriticalIssues && (
                <Alert variant="destructive">
                    <XCircle className="h-5 w-5" />
                    <AlertTitle>Critical Issues Detected</AlertTitle>
                    <AlertDescription>
                        This prescription has critical drug interactions, absolute contraindications, or high-risk allergy cross-sensitivities.
                        Review carefully before dispensing.
                    </AlertDescription>
                </Alert>
            )}

            {result.hasMajorIssues && !result.hasCriticalIssues && (
                <Alert>
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle>Major Issues Detected</AlertTitle>
                    <AlertDescription>
                        This prescription has major drug interactions or relative contraindications.
                        Clinical judgment and monitoring may be required.
                    </AlertDescription>
                </Alert>
            )}

            {/* Drug Interactions */}
            {result.interactions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Drug Interactions ({result.interactions.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {result.interactions.map((interaction, index) => (
                            <div key={interaction.id || index}>
                                {index > 0 && <Separator className="my-4" />}
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getSeverityIcon(interaction.severity)}
                                                <span className="font-semibold">
                                                    {interaction.drug_a} + {interaction.drug_b}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {interaction.description}
                                            </p>
                                        </div>
                                        <Badge variant={getSeverityColor(interaction.severity) as any}>
                                            {interaction.severity}
                                        </Badge>
                                    </div>

                                    {showDetails && (
                                        <>
                                            {interaction.clinical_effects && (
                                                <div className="pl-7">
                                                    <p className="text-sm">
                                                        <span className="font-medium">Clinical Effects: </span>
                                                        {interaction.clinical_effects}
                                                    </p>
                                                </div>
                                            )}
                                            {interaction.management_recommendation && (
                                                <div className="pl-7 bg-blue-50 p-3 rounded-md">
                                                    <p className="text-sm text-blue-900">
                                                        <span className="font-medium">Recommendation: </span>
                                                        {interaction.management_recommendation}
                                                    </p>
                                                </div>
                                            )}
                                            {interaction.evidence_level && (
                                                <div className="pl-7">
                                                    <Badge variant="outline" className="text-xs">
                                                        {interaction.evidence_level}
                                                    </Badge>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Contraindications */}
            {result.contraindications.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            Contraindications ({result.contraindications.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {result.contraindications.map((contraindication, index) => (
                            <div key={contraindication.id || index}>
                                {index > 0 && <Separator className="my-4" />}
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getSeverityIcon(contraindication.severity)}
                                                <span className="font-semibold">
                                                    {contraindication.drug_name}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Contraindicated in: {contraindication.condition}
                                            </p>
                                            <p className="text-sm mt-1">
                                                {contraindication.description}
                                            </p>
                                        </div>
                                        <Badge variant={getSeverityColor(contraindication.severity) as any}>
                                            {contraindication.severity}
                                        </Badge>
                                    </div>

                                    {showDetails && contraindication.alternative_recommendations && (
                                        <div className="pl-7 bg-green-50 p-3 rounded-md">
                                            <p className="text-sm text-green-900">
                                                <span className="font-medium">Alternatives: </span>
                                                {contraindication.alternative_recommendations}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Allergy Alerts */}
            {result.allergyAlerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-purple-600" />
                            Allergy Cross-Sensitivity Alerts ({result.allergyAlerts.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {result.allergyAlerts.map((alert, index) => (
                            <div key={alert.id || index}>
                                {index > 0 && <Separator className="my-4" />}
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getSeverityIcon(alert.cross_sensitivity)}
                                                <span className="font-semibold">
                                                    {alert.drug_name}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Patient allergic to: {alert.allergen}
                                            </p>
                                            <p className="text-sm mt-1">
                                                {alert.description}
                                            </p>
                                        </div>
                                        <Badge variant={getSeverityColor(alert.cross_sensitivity) as any}>
                                            {alert.cross_sensitivity} Risk
                                        </Badge>
                                    </div>

                                    {showDetails && alert.precautions && (
                                        <div className="pl-7 bg-yellow-50 p-3 rounded-md">
                                            <p className="text-sm text-yellow-900">
                                                <span className="font-medium">Precautions: </span>
                                                {alert.precautions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
