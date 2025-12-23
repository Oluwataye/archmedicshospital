import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

interface BulkUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (data: any[]) => Promise<void>;
    title: string;
    templateData: string; // CSV template content
    templateFileName: string;
    expectedFields: string[];
}

export default function BulkUploadModal({
    isOpen,
    onClose,
    onUpload,
    title,
    templateData,
    templateFileName,
    expectedFields
}: BulkUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                toast.error('Please upload a CSV file');
                return;
            }
            setFile(selectedFile);
            parseCSV(selectedFile);
        }
    };

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                if (lines.length < 2) {
                    setError('CSV file is empty or missing data rows');
                    return;
                }

                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const data = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim());
                    const obj: any = {};
                    headers.forEach((header, index) => {
                        // Find the original expected field that matches this header (case-insensitive)
                        const field = expectedFields.find(f => f.toLowerCase() === header);
                        if (field) {
                            obj[field] = values[index];
                        }
                    });
                    return obj;
                });

                // Validation
                const missingFields = expectedFields.filter(f => !headers.includes(f.toLowerCase()));
                if (missingFields.length > 0) {
                    setError(`Missing required columns: ${missingFields.join(', ')}`);
                    setPreview(null);
                } else {
                    setError(null);
                    setPreview(data);
                }
            } catch (err) {
                console.error('Error parsing CSV:', err);
                setError('Failed to parse CSV file. Please check the format.');
            }
        };
        reader.readAsText(file);
    };

    const handleUpload = async () => {
        if (!preview || preview.length === 0) return;

        try {
            setLoading(true);
            await onUpload(preview);
            toast.success('Bulk upload successful');
            handleClose();
        } catch (err: any) {
            console.error('Upload failed:', err);
            toast.error(err.message || 'Bulk upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        onClose();
    };

    const downloadTemplate = () => {
        const blob = new Blob([templateData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = templateFileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file containing multiple inventory items to add them in bulk.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">1. Download Template</h4>
                        <Button variant="outline" size="sm" onClick={downloadTemplate}>
                            <Download className="mr-2 h-4 w-4" /> Download CSV Template
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">2. Upload File</h4>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${file ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                accept=".csv"
                                onChange={handleFileChange}
                            />
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <FileText className="h-10 w-10 text-primary mb-2" />
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                    <button
                                        className="mt-2 text-xs text-red-500 hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setPreview(null);
                                            setError(null);
                                        }}
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                    <p className="text-sm">Click or drag to upload CSV</p>
                                    <p className="text-xs text-muted-foreground mt-1">Expected columns: {expectedFields.join(', ')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Upload Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {preview && !error && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Preview ({preview.length} items)</h4>
                                <div className="flex items-center text-xs text-green-600 font-medium">
                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Ready to upload
                                </div>
                            </div>
                            <div className="max-h-40 overflow-y-auto border rounded-md">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-gray-50 border-b sticky top-0">
                                        <tr>
                                            {expectedFields.slice(0, 4).map(f => (
                                                <th key={f} className="px-3 py-2 font-medium uppercase tracking-wider">{f}</th>
                                            ))}
                                            {expectedFields.length > 4 && <th className="px-3 py-2">...</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {preview.slice(0, 5).map((row, i) => (
                                            <tr key={i}>
                                                {expectedFields.slice(0, 4).map(f => (
                                                    <td key={f} className="px-3 py-2 truncate max-w-[100px]">{row[f] || '-'}</td>
                                                ))}
                                                {expectedFields.length > 4 && <td className="px-3 py-2">...</td>}
                                            </tr>
                                        ))}
                                        {preview.length > 5 && (
                                            <tr>
                                                <td colSpan={5} className="px-3 py-2 text-center text-muted-foreground italic">
                                                    + {preview.length - 5} more items
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!preview || !!error || loading}
                        className="min-w-[100px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                            </>
                        ) : (
                            'Upload Items'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
