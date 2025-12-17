import React, { useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from 'lucide-react';
import { useHospitalSettings } from '@/contexts/HospitalSettingsContext';

interface ReceiptItem {
    description: string;
    amount: number;
    quantity: number;
}

interface ReceiptData {
    receiptNumber: string;
    date: string;
    patientName: string;
    patientId: string;
    items: ReceiptItem[];
    totalAmount: number;
    discount: number;
    netAmount: number;
    paymentMethod: string;
    cashierName: string;
}

interface ReceiptModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: ReceiptData | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ open, onOpenChange, data }) => {
    const receiptRef = useRef<HTMLDivElement>(null);
    const { settings } = useHospitalSettings();

    const handlePrint = () => {
        if (!receiptRef.current) return;

        const printContent = receiptRef.current.innerHTML;
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(`
                <html>
                <head>
                    <title>Print Receipt</title>
                    <style>
                        body { font-family: monospace; padding: 20px; font-size: 12px; color: #000; }
                        .text-center { text-align: center; }
                        .font-bold { font-weight: bold; }
                        .text-lg { font-size: 16px; }
                        .mb-4 { margin-bottom: 1rem; }
                        .mb-2 { margin-bottom: 0.5rem; }
                        .mb-1 { margin-bottom: 0.25rem; }
                        .mt-2 { margin-top: 0.5rem; }
                        .mt-4 { margin-top: 1rem; }
                        .flex { display: flex; }
                        .justify-between { justify-content: space-between; }
                        .border-b { border-bottom: 1px dashed #000; }
                        .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
                        .w-8 { width: 2rem; }
                        .w-16 { width: 4rem; }
                        .text-right { text-align: right; }
                        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                        .flex-1 { flex: 1; }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
                </html>
            `);
            doc.close();
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(iframe);
                onOpenChange(false);
            }, 1000);
        }
    };

    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Transaction Receipt</DialogTitle>
                    <DialogDescription className="text-center">
                        Review the transaction details below. Use the print button to generate a copy.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-white text-black p-4 text-xs font-mono border rounded-sm" ref={receiptRef}>
                    <div className="text-center mb-4">
                        <h2 className="text-lg font-bold">{settings?.hospital_name?.toUpperCase() || 'HOSPITAL'}</h2>
                        <p>{settings?.address || '123 Medical Drive, Health City'}</p>
                        <p>Tel: {settings?.phone || '+234 800 123 4567'}</p>
                        <p>Email: {settings?.email || 'billing@hospital.com'}</p>
                    </div>

                    <div className="border-b border-dashed my-2"></div>

                    <div className="flex justify-between mb-1">
                        <span>Receipt No:</span>
                        <span>{data.receiptNumber}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Date:</span>
                        <span>{new Date(data.date).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Cashier:</span>
                        <span>{data.cashierName}</span>
                    </div>

                    <div className="border-b border-dashed my-2"></div>

                    <div className="flex justify-between mb-1">
                        <span>Patient:</span>
                        <span className="font-bold">{data.patientName}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>PID/MRN:</span>
                        <span>{data.patientId}</span>
                    </div>

                    <div className="border-b border-dashed my-2"></div>

                    <div className="mb-2">
                        <div className="flex font-bold mb-1">
                            <span className="flex-1">Item</span>
                            <span className="w-8 text-center">Qty</span>
                            <span className="w-16 text-right">Amt</span>
                        </div>
                        {data.items.map((item, index) => (
                            <div key={index} className="flex mb-1">
                                <span className="flex-1 truncate pr-1">{item.description}</span>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <span className="w-16 text-right">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-b border-dashed my-2"></div>

                    <div className="flex justify-between mb-1">
                        <span>Subtotal:</span>
                        <span>{data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {data.discount > 0 && (
                        <div className="flex justify-between mb-1">
                            <span>Discount:</span>
                            <span>-{data.discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-sm mt-2">
                        <span>TOTAL PAID:</span>
                        <span>₦{data.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between mt-1 italic">
                        <span>Method:</span>
                        <span>{data.paymentMethod}</span>
                    </div>

                    <div className="border-b border-dashed my-4"></div>

                    <div className="text-center">
                        <p>Thank you for choosing {settings?.hospital_name || 'our hospital'}!</p>
                        <p>Get well soon.</p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Receipt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReceiptModal;
