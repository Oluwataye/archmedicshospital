import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ConsultationForm: React.FC = () => {
    return (
        <form className="space-y-4">
            <div>
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea id="symptoms" placeholder="Patient symptoms..." />
            </div>
            <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input id="diagnosis" placeholder="Diagnosis..." />
            </div>
            <Button type="submit">Save Consultation</Button>
        </form>
    );
};

export default ConsultationForm;
