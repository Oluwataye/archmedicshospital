import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AppointmentForm: React.FC<any> = ({ open, onOpenChange, onSubmit }) => {
    return (
        <form className="space-y-4">
            <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
            </div>
            <Button type="submit">Schedule Appointment</Button>
        </form>
    );
};

export default AppointmentForm;
