import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PatientRegistrationModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSave?: (data: any) => void;
}

const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({ open, onOpenChange, onSave }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>Register Patient</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" className="col-span-3" />
                    </div>
                </div>
                <Button onClick={() => onSave?.({})}>Save</Button>
            </DialogContent>
        </Dialog>
    );
};

export default PatientRegistrationModal;
