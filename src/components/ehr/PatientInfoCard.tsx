import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Printer, Share2, MapPin, Phone, Mail, Calendar } from 'lucide-react';

interface PatientInfoCardProps {
    patient: any;
    onEdit?: () => void;
    onPrint?: () => void;
    onShare?: () => void;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patient, onEdit, onPrint, onShare }) => {
    if (!patient) return null;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 items-start">
            <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                <AvatarImage src={patient.avatar} alt={patient.name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                    {getInitials(patient.name)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-foreground">{patient.name}</h2>
                            <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>
                                {patient.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 font-mono">ID: {patient.id}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={onPrint}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" size="sm" onClick={onShare}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>DOB: {patient.dob} ({patient.age} yrs)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="font-semibold text-foreground">Gender:</div>
                        <span>{patient.gender}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{patient.address}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientInfoCard;
