import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ShareRecordsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patientId: string;
    patientName: string;
}

const ShareRecordsModal: React.FC<ShareRecordsModalProps> = ({
    open,
    onOpenChange,
    patientId,
    patientName
}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({
        medicalHistory: true,
        labResults: true,
        prescriptions: false,
        imaging: false
    });

    const handleShare = async () => {
        if (!email) {
            toast.error("Please enter an email address");
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success(`Records shared with ${email}`);
            onOpenChange(false);
            setEmail('');
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Records - {patientName}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Recipient Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="doctor@hospital.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Include Records</Label>
                        <div className="space-y-2 border rounded-md p-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="history"
                                    checked={options.medicalHistory}
                                    onCheckedChange={(checked) => setOptions({ ...options, medicalHistory: !!checked })}
                                />
                                <Label htmlFor="history">Medical History</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="labs"
                                    checked={options.labResults}
                                    onCheckedChange={(checked) => setOptions({ ...options, labResults: !!checked })}
                                />
                                <Label htmlFor="labs">Lab Results</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="rx"
                                    checked={options.prescriptions}
                                    onCheckedChange={(checked) => setOptions({ ...options, prescriptions: !!checked })}
                                />
                                <Label htmlFor="rx">Prescriptions</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="imaging"
                                    checked={options.imaging}
                                    onCheckedChange={(checked) => setOptions({ ...options, imaging: !!checked })}
                                />
                                <Label htmlFor="imaging">Imaging Reports</Label>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleShare} disabled={loading}>
                        {loading ? "Sharing..." : "Share Records"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ShareRecordsModal;
