import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    status: string;
    lastVisit: string;
    avatar?: string;
    dob: string;
    address: string;
    phone: string;
    email: string;
    doctor: string;
    records: number;
}

interface PatientCardsListProps {
    patients: Patient[];
    selectedPatient: Patient | null;
    onSelectPatient: (patient: Patient) => void;
}

const PatientCardsList: React.FC<PatientCardsListProps> = ({ patients, selectedPatient, onSelectPatient }) => {
    if (!patients || patients.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No patients found matching your criteria.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {patients.map((patient) => (
                <Card
                    key={patient.id}
                    className={cn(
                        "cursor-pointer transition-all hover:shadow-md border-2",
                        selectedPatient?.id === patient.id
                            ? "border-primary bg-primary/5"
                            : "border-transparent hover:border-primary/20"
                    )}
                    onClick={() => onSelectPatient(patient)}
                >
                    <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background">
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold truncate">{patient.name}</h3>
                                <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                                    {patient.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                                ID: {patient.id} • {patient.age} yrs • {patient.gender}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Last Visit: {patient.lastVisit}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default PatientCardsList;
