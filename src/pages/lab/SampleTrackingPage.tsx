import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SampleCollectionForm from '@/components/lab/SampleCollectionForm';
import SampleBarcodeScanner from '@/components/lab/SampleBarcodeScanner';
import { ApiService } from '@/services/apiService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SampleTrackingPage() {
    const [activeTab, setActiveTab] = useState('collection');
    const [samples, setSamples] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (activeTab === 'history') {
            loadSamples();
        }
    }, [activeTab]);

    const loadSamples = async () => {
        try {
            const data = await ApiService.getSamples({ barcode: search });
            setSamples(data);
        } catch (error) {
            console.error('Error loading samples:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadSamples();
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sample Tracking</h1>
                <p className="text-muted-foreground mt-1">Manage specimen collection, tracking, and processing.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="collection">Collection</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                    <TabsTrigger value="history">Sample History</TabsTrigger>
                </TabsList>

                <TabsContent value="collection">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <SampleCollectionForm onSuccess={() => setActiveTab('history')} />
                        </div>
                        <div className="hidden md:block">
                            <Card className="bg-muted/50 border-dashed">
                                <CardHeader>
                                    <CardTitle>Guidelines</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-2">
                                    <p>1. Verify patient identity using two identifiers.</p>
                                    <p>2. Select the correct sample type as per test requirements.</p>
                                    <p>3. Generate barcode and affix it immediately to the container.</p>
                                    <p>4. Ensure proper storage conditions until transport.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="processing">
                    <div className="max-w-2xl mx-auto">
                        <SampleBarcodeScanner onScanSuccess={() => { }} />
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Samples</CardTitle>
                            <CardDescription>View and filter all collected samples.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search barcode..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <Button onClick={handleSearch} variant="secondary">Filter</Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Barcode</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Collector</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {samples.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">No samples found</TableCell>
                                        </TableRow>
                                    ) : (
                                        samples.map(sample => (
                                            <TableRow key={sample.id}>
                                                <TableCell>{new Date(sample.collection_date).toLocaleDateString()} {new Date(sample.collection_date).toLocaleTimeString()}</TableCell>
                                                <TableCell className="font-mono">{sample.barcode}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{sample.patient_first_name} {sample.patient_last_name}</div>
                                                    <div className="text-xs text-muted-foreground">{sample.patient_mrn}</div>
                                                </TableCell>
                                                <TableCell>{sample.sample_type}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        sample.status === 'completed' ? 'default' : // default is actually black usually, let's use variants if available or just class
                                                            sample.status === 'rejected' ? 'destructive' :
                                                                sample.status === 'processing' ? 'secondary' : 'outline'
                                                    } className={
                                                        sample.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                                            sample.status === 'processing' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''
                                                    }>
                                                        {sample.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{sample.collector_first_name} {sample.collector_last_name}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
