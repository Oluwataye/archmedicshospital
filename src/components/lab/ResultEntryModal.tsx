import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';

interface ResultEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onResultSaved: () => void;
}

export default function ResultEntryModal({ isOpen, onClose, order, onResultSaved }: ResultEntryModalProps) {
    const [loading, setLoading] = useState(false);
    const [testDefinition, setTestDefinition] = useState<any>(null);
    const [resultValue, setResultValue] = useState('');
    const [interpretation, setInterpretation] = useState('');
    const [isCritical, setIsCritical] = useState(false);
    const [flagStatus, setFlagStatus] = useState<'normal' | 'high' | 'low' | 'critical' | null>(null);

    useEffect(() => {
        if (isOpen && order) {
            loadTestDefinition();
            // If viewing existing results, load them
            if (order.results) {
                try {
                    const parsedResults = typeof order.results === 'string' ? JSON.parse(order.results) : order.results;
                    setResultValue(parsedResults.value || '');
                    setInterpretation(order.interpretation || '');
                    setIsCritical(order.critical_values || false);
                } catch (e) {
                    console.error('Error parsing results:', e);
                }
            } else {
                setResultValue('');
                setInterpretation('');
                setIsCritical(false);
                setFlagStatus(null);
            }
        }
    }, [isOpen, order]);

    const loadTestDefinition = async () => {
        try {
            // Try to find matching test definition
            const definitions = await ApiService.getLabResults({ /* endpoint might need adjustment */ });
            // For now, we'll use a simplified approach
            setTestDefinition(null);
        } catch (error) {
            console.error('Error loading test definition:', error);
        }
    };

    const checkReferenceRange = (value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || !testDefinition) {
            setFlagStatus(null);
            setIsCritical(false);
            return;
        }

        const { reference_range_min, reference_range_max, critical_low, critical_high } = testDefinition;

        if (critical_low && numValue <= critical_low) {
            setFlagStatus('critical');
            setIsCritical(true);
        } else if (critical_high && numValue >= critical_high) {
            setFlagStatus('critical');
            setIsCritical(true);
        } else if (reference_range_min && numValue < reference_range_min) {
            setFlagStatus('low');
            setIsCritical(false);
        } else if (reference_range_max && numValue > reference_range_max) {
            setFlagStatus('high');
            setIsCritical(false);
        } else {
            setFlagStatus('normal');
            setIsCritical(false);
        }
    };

    const handleValueChange = (value: string) => {
        setResultValue(value);
        checkReferenceRange(value);
    };

    const validateForm = () => {
        if (!resultValue.trim()) {
            toast.error('Please enter a result value');
            return false;
        }
        return true;
    };

    const handleCancel = () => {
        if (resultValue || interpretation) {
            if (!window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                return;
            }
        }
        onClose();
    };

    const handleSave = async (status: 'draft' | 'final') => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const resultData = {
                value: resultValue,
                flag: flagStatus,
                unit: testDefinition?.unit || ''
            };

            await ApiService.updateLabResult(order.id, {
                results: JSON.stringify(resultData),
                interpretation,
                critical_values: isCritical,
                status: status === 'final' ? 'completed' : 'pending',
                result_date: status === 'final' ? new Date().toISOString() : null
            });

            toast.success(`Results saved as ${status}`);
            onResultSaved();
            onClose();
        } catch (error) {
            console.error('Error saving results:', error);
            toast.error('Failed to save results');
        } finally {
            setLoading(false);
        }
    };

    if (!order) return null;

    const isViewOnly = order.status === 'completed';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isViewOnly ? 'View' : 'Enter'} Lab Results - {order.test_name}
                    </DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            {isViewOnly ? 'Review laboratory test results.' : 'Input laboratory test result values and clinical interpretations.'}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Patient Info */}
                    <div className="bg-slate-50 p-4 rounded-lg border">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">Patient</Label>
                                <p className="font-medium">{order.patient_first_name} {order.patient_last_name}</p>
                                <p className="text-sm text-muted-foreground">MRN: {order.patient_mrn}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Test</Label>
                                <p className="font-medium">{order.test_name}</p>
                                <p className="text-sm text-muted-foreground">Type: {order.test_type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Result Entry */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Result Value *</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="text"
                                    value={resultValue}
                                    onChange={(e) => handleValueChange(e.target.value)}
                                    disabled={isViewOnly}
                                    placeholder="Enter numeric value or text result"
                                    className="flex-1"
                                />
                                {testDefinition?.unit && (
                                    <span className="text-sm text-muted-foreground min-w-[60px]">
                                        {testDefinition.unit}
                                    </span>
                                )}
                            </div>

                            {/* Flag Status */}
                            {flagStatus && (
                                <div className="flex items-center gap-2 mt-2">
                                    {flagStatus === 'critical' && (
                                        <Badge variant="destructive" className="flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" /> CRITICAL VALUE
                                        </Badge>
                                    )}
                                    {flagStatus === 'high' && (
                                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                            HIGH
                                        </Badge>
                                    )}
                                    {flagStatus === 'low' && (
                                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                            LOW
                                        </Badge>
                                    )}
                                    {flagStatus === 'normal' && (
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 flex items-center gap-1">
                                            <Check className="h-3 w-3" /> NORMAL
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Reference Range */}
                            {testDefinition && (
                                <p className="text-xs text-muted-foreground">
                                    Reference Range: {testDefinition.reference_range_min} - {testDefinition.reference_range_max} {testDefinition.unit}
                                    {testDefinition.critical_low && testDefinition.critical_high && (
                                        <> | Critical: &lt;{testDefinition.critical_low} or &gt;{testDefinition.critical_high}</>
                                    )}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Interpretation / Notes</Label>
                            <Textarea
                                value={interpretation}
                                onChange={(e) => setInterpretation(e.target.value)}
                                disabled={isViewOnly}
                                placeholder="Add clinical interpretation or notes..."
                                rows={4}
                            />
                        </div>

                        {isCritical && !isViewOnly && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-900">Critical Value Alert</p>
                                        <p className="text-sm text-red-700">
                                            This result is outside critical limits. Ensure immediate physician notification.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>
                    {!isViewOnly && (
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => handleSave('draft')}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save as Draft'}
                            </Button>
                            <Button
                                onClick={() => handleSave('final')}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? 'Saving...' : 'Save as Final'}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
