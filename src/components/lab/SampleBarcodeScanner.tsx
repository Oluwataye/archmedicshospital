import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';
import { Loader2, ScanBarcode, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SampleBarcodeScannerProps {
    onScanSuccess?: () => void;
}

export default function SampleBarcodeScanner({ onScanSuccess }: SampleBarcodeScannerProps) {
    const [barcode, setBarcode] = useState('');
    const [loading, setLoading] = useState(false);
    const [scannedSample, setScannedSample] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcode) return;

        try {
            setLoading(true);
            setScannedSample(null);
            const data = await ApiService.getSampleByBarcode(barcode);
            setScannedSample(data);
            toast.success('Sample found');
        } catch (error) {
            console.error('Error scanning barcode:', error);
            toast.error('Sample not found or valid');
            setScannedSample(null);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status: string, reason?: string) => {
        if (!scannedSample) return;
        try {
            setProcessing(true);
            if (status === 'rejected') {
                await ApiService.rejectSample(scannedSample.id, reason || 'Rejected by processor');
                toast.error('Sample Rejected');
            } else {
                await ApiService.updateSampleStatus(scannedSample.id, status);
                toast.success(`Status updated to ${status}`);
            }

            // Refresh
            const updated = await ApiService.getSampleByBarcode(barcode);
            setScannedSample(updated);
            if (onScanSuccess) onScanSuccess();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sample Scanner</CardTitle>
                    <CardDescription>Scan a barcode to view details and update specimen status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleScan} className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="barcode" className="sr-only">Barcode</Label>
                            <Input
                                id="barcode"
                                placeholder="Scan or enter barcode (e.g., LAB-XXXXX)"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                className="font-mono"
                                autoFocus
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanBarcode className="h-4 w-4 mr-2" />}
                            Scan
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {scannedSample && (
                <Card className="animate-in fade-in slide-in-from-bottom-4">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl font-mono text-primary">{scannedSample.barcode}</CardTitle>
                                <CardDescription>
                                    Collected: {new Date(scannedSample.collection_date).toLocaleString()}
                                </CardDescription>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold capitalize
                ${scannedSample.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    scannedSample.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        scannedSample.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'}`}>
                                {scannedSample.status}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <Label className="text-muted-foreground">Patient</Label>
                                <div className="font-medium">{scannedSample.patient_first_name} {scannedSample.patient_last_name}</div>
                                <div className="text-xs text-muted-foreground">MRN: {scannedSample.patient_mrn}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Sample Type</Label>
                                <div className="font-medium">{scannedSample.sample_type}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Collector</Label>
                                <div className="font-medium">{scannedSample.collector_first_name} {scannedSample.collector_last_name || 'System'}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Linked Test</Label>
                                <div className="font-medium">{scannedSample.test_name || 'N/A'}</div>
                            </div>
                            {scannedSample.rejection_reason && (
                                <div className="col-span-2">
                                    <Alert variant="destructive">
                                        <XCircle className="h-4 w-4" />
                                        <AlertTitle>Rejection Reason</AlertTitle>
                                        <AlertDescription>
                                            {scannedSample.rejection_reason}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                            <Button
                                variant="default"
                                size="sm"
                                disabled={processing || scannedSample.status === 'processing' || scannedSample.status === 'rejected'}
                                onClick={() => updateStatus('processing')}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" /> Start Processing
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                disabled={processing || scannedSample.status === 'completed' || scannedSample.status === 'rejected'}
                                onClick={() => updateStatus('completed')}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Mark Completed
                            </Button>

                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={processing || scannedSample.status === 'rejected'}
                                onClick={() => {
                                    const reason = prompt("Enter rejection reason:");
                                    if (reason) updateStatus('rejected', reason);
                                }}
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Reject Sample
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
