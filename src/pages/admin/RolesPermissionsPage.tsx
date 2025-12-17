
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Shield, Check } from 'lucide-react';

const RolesPermissionsPage = () => {
    // Static roles definition based on system architecture
    const roles = [
        {
            name: 'admin',
            description: 'Full system access. Can manage users, settings, and view all reports.',
            permissions: ['manage_users', 'manage_settings', 'view_all_reports', 'manage_finances']
        },
        {
            name: 'doctor',
            description: 'Clinical access. Can manage patients, appointments, prescriptions, and lab orders.',
            permissions: ['manage_patients', 'create_prescriptions', 'create_lab_orders', 'view_medical_records']
        },
        {
            name: 'nurse',
            description: 'Patient care. Can view records, record vitals, administer medication.',
            permissions: ['view_patients', 'record_vitals', 'administer_medication', 'view_medical_records']
        },
        {
            name: 'pharmacist',
            description: 'Pharmacy operations. Can dispense medication and manage inventory.',
            permissions: ['dispense_medication', 'manage_inventory', 'view_prescriptions']
        },
        {
            name: 'labtech',
            description: 'Laboratory operations. Can process lab orders and enter results.',
            permissions: ['process_lab_orders', 'enter_lab_results', 'manage_lab_inventory']
        },
        {
            name: 'cashier',
            description: 'Financial operations. Can process payments and view invoices.',
            permissions: ['process_payments', 'view_invoices', 'manage_billing']
        },
        {
            name: 'ehr',
            description: 'Records management. Can manage patient records and specific administrative tasks.',
            permissions: ['manage_records', 'view_analytics', 'manage_appointments']
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Roles & Permissions</h1>
                <p className="text-gray-500">Overview of system roles and their capabilities</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Roles</CardTitle>
                    <CardDescription>Defined roles and their access levels</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Key Permissions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.name}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-blue-500" />
                                            <span className="capitalize">{role.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{role.description}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.map(perm => (
                                                <Badge key={perm} variant="secondary" className="text-xs">
                                                    {perm.replace(/_/g, ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RolesPermissionsPage;
