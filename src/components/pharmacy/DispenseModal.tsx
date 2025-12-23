import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Scan, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';
import InteractionAlerts from '@/components/pharmacy/InteractionAlerts';
import VerificationChecklist from '@/components/pharmacy/VerificationChecklist';
import CounselingNotes from '@/components/pharmacy/CounselingNotes';

interface DispenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    prescription: any;
    onDispenseComplete: () => void;
}

export default function DispenseModal({ isOpen, onClose, prescription, onDispenseComplete }: DispenseModalProps) {
    const [step, setStep] = useState(1); // 1: Review & Interactions, 2: Verification & Stock, 3: Counseling
    const [loading, setLoading] = useState(false);
    const [interactionResult, setInteractionResult] = useState<any>(null);
    const [medications, setMedications] = useState<any[]>([]);
    const [stockStatus, setStockStatus] = useState<any>({});
    const [scannedItems, setScannedItems] = useState<Set<string>>(new Set());
    const [notes, setNotes] = useState('');
    const [dispenseType, setDispenseType] = useState('fill');

    // New state for checklists
    const [verificationChecks, setVerificationChecks] = useState<{ [key: string]: boolean }>({});
    const [counselingPoints, setCounselingPoints] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (isOpen && prescription) {
            initializeModal();
        }
    }, [isOpen, prescription]);

    const initializeModal = async () => {
        setStep(1);
        setLoading(true);
        setScannedItems(new Set());
        setNotes('');
        setVerificationChecks({});
        setCounselingPoints({});

        // Determine default dispense type
        if (prescription.status === 'dispensed' && (prescription.refills_remaining > 0)) {
            setDispenseType('refill');
        } else {
            setDispenseType('fill');
        }

        try {
            // Parse medications
            const meds = typeof prescription.medications === 'string'
                ? JSON.parse(prescription.medications)
                : prescription.medications;
            setMedications(meds);

            // Check interactions
            const drugNames = meds.map((m: any) => m.name || m);

            // Fetch patient details for conditions/allergies
            const patient = await ApiService.getPatient(prescription.patient_id);
            const conditions = patient.medical_history ? JSON.parse(patient.medical_history) : [];
            const allergies = patient.allergies ? JSON.parse(patient.allergies) : [];

            const interactions = await ApiService.checkDrugInteractions(drugNames, conditions, allergies);
            setInteractionResult(interactions);

            // Check stock for each med
            const stockMap: any = {};
            for (const med of meds) {
                const name = med.name || med;
                // Simple search by name
                const inventoryItems = await ApiService.getInventoryItems({ search: name });
                const matchingItem = inventoryItems.find((i: any) => i.name.toLowerCase().includes(name.toLowerCase()));

                if (matchingItem) {
                    stockMap[name] = {
                        available: true,
                        item: matchingItem,
                        sufficient: matchingItem.current_stock > 0 // Simplified check
                    };
                } else {
                    stockMap[name] = { available: false };
                }
            }
            setStockStatus(stockMap);

        } catch (error) {
            console.error('Error initializing dispense modal:', error);
            toast.error('Failed to load prescription details');
        } finally {
            setLoading(false);
        }
    };

    const handleSimulateScan = (medName: string) => {
        const newScanned = new Set(scannedItems);
        newScanned.add(medName);
        setScannedItems(newScanned);
        toast.success(`Scanned: ${medName}`);
    };

    const handleCheckChange = (key: string, checked: boolean) => {
        setVerificationChecks(prev => ({ ...prev, [key]: checked }));
    };

    const handleCounselingPointChange = (key: string, checked: boolean) => {
        setCounselingPoints(prev => ({ ...prev, [key]: checked }));
    };

    const handleCancel = () => {
        if (step > 1 || notes || Object.keys(verificationChecks).length > 0) {
            if (!window.confirm('Are you sure you want to cancel? Any progress will be lost.')) {
                return;
            }
        }
        onClose();
    };

    const handleDispense = async (status: 'draft' | 'final') => {
        // Validation for final dispense
        if (status === 'final') {
            const allScanned = medications.every(med => scannedItems.has(med.name || med));
            if (!allScanned) {
                toast.error('Please scan all medications before finalizing');
                return;
            }

            const requiredChecks = ['patient_identity', 'medication_match', 'dosage_correct'];
            const allChecked = requiredChecks.every(check => verificationChecks[check]);
            if (!allChecked) {
                toast.error('Please complete all required verification checks');
                return;
            }
        }

        try {
            setLoading(true);

            // Prepare items for stock deduction (only for final dispense)
            const itemsToDeduct = status === 'final' ? medications.map(med => {
                const name = med.name || med;
                const stockInfo = stockStatus[name];
                if (stockInfo?.available) {
                    return {
                        item_id: stockInfo.item.id,
                        quantity: 1
                    };
                }
                return null;
            }).filter(Boolean) : [];

            // Construct detailed notes
            const detailedNotes = `
Dispensing Notes: ${notes}

Status: ${status.toUpperCase()}
Dispense Type: ${dispenseType.toUpperCase()}

Verification Checks:
${Object.entries(verificationChecks).filter(([_, v]) => v).map(([k]) => `- ${k}`).join('\n')}

Counseling Points Covered:
${Object.entries(counselingPoints).filter(([_, v]) => v).map(([k]) => `- ${k}`).join('\n')}
            `.trim();

            await ApiService.dispensePrescription(prescription.id, {
                notes: detailedNotes,
                items: itemsToDeduct,
                type: dispenseType,
                status: status
            });

            toast.success(`Prescription ${status === 'final' ? 'dispensed' : 'saved as draft'} successfully`);
            onDispenseComplete();
            onClose();
        } catch (error) {
            console.error('Error dispensing:', error);
            toast.error('Failed to dispense prescription');
        } finally {
            setLoading(false);
        }
    };

    if (!prescription) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Dispense Prescription #{prescription.id.slice(0, 8)}</DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            Dispense medications for the selected prescription. Review drug interactions, verify stock, and provide counseling.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Progress Steps */}
                    <div className="flex justify-between items-center px-4 py-2 bg-secondary/20 rounded-lg">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">1</div>
                            Review
                        </div>
                        <div className={`h-px flex-1 bg-border mx-4`} />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">2</div>
                            Verify
                        </div>
                        <div className={`h-px flex-1 bg-border mx-4`} />
                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">3</div>
                            Counsel
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Patient</Label>
                                    <p className="font-medium">{prescription.patient_first_name} {prescription.patient_last_name}</p>
                                    <p className="text-sm text-muted-foreground">MRN: {prescription.patient_mrn}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Prescriber</Label>
                                    <p className="font-medium">Dr. {prescription.prescriber_first_name} {prescription.prescriber_last_name}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg space-y-3 border">
                                <Label>Dispense Type</Label>
                                <Select value={dispenseType} onValueChange={setDispenseType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fill">Full Fill</SelectItem>
                                        <SelectItem value="partial">Partial Fill</SelectItem>
                                        <SelectItem value="refill" disabled={!prescription.refills_remaining}>
                                            Refill ({prescription.refills_remaining || 0} remaining)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {prescription.refills_authorized > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Refills: {prescription.refills_remaining} of {prescription.refills_authorized} remaining
                                    </p>
                                )}
                            </div>

                            <div className="border rounded-md p-4">
                                <Label className="mb-2 block">Medications</Label>
                                <ul className="list-disc pl-5 space-y-1">
                                    {medications.map((med: any, idx: number) => (
                                        <li key={idx}>{med.name || med} - {med.dosage || ''} {med.frequency || ''}</li>
                                    ))}
                                </ul>
                            </div>

                            {interactionResult && (
                                <InteractionAlerts result={interactionResult} showDetails={true} />
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label>Scan & Verify Medications</Label>
                                <div className="space-y-3">
                                    {medications.map((med: any, idx: number) => {
                                        const name = med.name || med;
                                        const stock = stockStatus[name];
                                        const isScanned = scannedItems.has(name);

                                        return (
                                            <div key={idx} className={`p-3 border rounded-lg flex items-center justify-between ${isScanned ? 'bg-green-50 border-green-200' : ''}`}>
                                                <div>
                                                    <p className="font-medium">{name}</p>
                                                    <div className="flex gap-2 text-sm mt-1">
                                                        {stock?.available ? (
                                                            <Badge variant="outline" className="text-green-600 border-green-200">
                                                                In Stock: {stock.item.current_stock}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="destructive">Out of Stock</Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {isScanned ? (
                                                    <div className="flex items-center text-green-600">
                                                        <Check className="w-5 h-5 mr-1" /> Verified
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => handleSimulateScan(name)}
                                                        disabled={!stock?.available}
                                                    >
                                                        <Scan className="w-4 h-4 mr-2" /> Scan
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <VerificationChecklist
                                checks={verificationChecks}
                                onCheckChange={handleCheckChange}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <CounselingNotes
                            notes={notes}
                            onNotesChange={setNotes}
                            pointsCovered={counselingPoints}
                            onPointChange={handleCounselingPointChange}
                        />
                    )}
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>

                    {step > 1 && (
                        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
                            Back
                        </Button>
                    )}

                    {step < 3 ? (
                        <Button onClick={() => setStep(step + 1)}>
                            Next
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => handleDispense('draft')}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save as Draft'}
                            </Button>
                            <Button
                                onClick={() => handleDispense('final')}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? 'Dispensing...' : 'Confirm & Dispense'}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
