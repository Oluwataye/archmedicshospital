import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Edit, Eye, Trash2, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface ConsultNote {
    id: string;
    patient_id: string;
    provider_id: string;
    provider_name: string;
    record_date: string;
    title: string;
    content: string;
    status: 'draft' | 'final' | 'amended';
    created_at: string;
    updated_at: string;
}

interface ConsultNotesTabProps {
    patientId: string;
    consultNotes: ConsultNote[];
    currentUserId: string;
    currentUserRole: string;
    onCreateNote: () => void;
    onEditNote: (note: ConsultNote) => void;
    onViewNote: (note: ConsultNote) => void;
    onDeleteNote: (noteId: string) => void;
}

export default function ConsultNotesTab({
    patientId,
    consultNotes,
    currentUserId,
    currentUserRole,
    onCreateNote,
    onEditNote,
    onViewNote,
    onDeleteNote
}: ConsultNotesTabProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter notes based on search query
    const filteredNotes = consultNotes.filter(note => {
        const query = searchQuery.toLowerCase();
        return (
            note.title.toLowerCase().includes(query) ||
            note.provider_name.toLowerCase().includes(query) ||
            note.status.toLowerCase().includes(query)
        );
    });

    // Check if note can be edited (24-hour window + ownership)
    const canEditNote = (note: ConsultNote): { allowed: boolean; reason?: string } => {
        // Admin can always edit
        if (currentUserRole === 'admin') {
            return { allowed: true };
        }

        // Check ownership
        if (note.provider_id !== currentUserId) {
            return { allowed: false, reason: 'You can only edit your own notes' };
        }

        // Check 24-hour window
        const createdAt = new Date(note.created_at);
        const now = new Date();
        const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceCreation > 24) {
            return { allowed: false, reason: '24-hour edit window has expired' };
        }

        return { allowed: true };
    };

    // Check if note can be deleted
    const canDeleteNote = (note: ConsultNote): boolean => {
        if (currentUserRole === 'admin') return true;
        if (note.provider_id === currentUserId) return true;
        return false;
    };

    // Get time remaining for edit
    const getTimeRemaining = (createdAt: string): string => {
        const created = new Date(createdAt);
        const now = new Date();
        const hoursSinceCreation = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
        const hoursRemaining = 24 - hoursSinceCreation;

        if (hoursRemaining <= 0) return 'Expired';
        if (hoursRemaining < 1) return `${Math.floor(hoursRemaining * 60)} minutes`;
        return `${Math.floor(hoursRemaining)} hours`;
    };

    const handleEdit = (note: ConsultNote) => {
        const editCheck = canEditNote(note);
        if (!editCheck.allowed) {
            toast.error(editCheck.reason || 'Cannot edit this note');
            return;
        }
        onEditNote(note);
    };

    const handleDelete = (noteId: string) => {
        if (window.confirm('Are you sure you want to delete this consult note?')) {
            onDeleteNote(noteId);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Consult Notes</h3>
                    <p className="text-sm text-muted-foreground">
                        Patient consultation history and progress notes
                    </p>
                </div>
                <Button onClick={onCreateNote}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Consult Note
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search consult notes by title, provider, or status..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Consult Notes Table */}
            {filteredNotes.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground mb-4">
                        {searchQuery ? 'No matching consult notes found' : 'No consult notes found'}
                    </p>
                    {!searchQuery && (
                        <Button onClick={onCreateNote} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Note
                        </Button>
                    )}
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Edit Window</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredNotes.map((note) => {
                                const editCheck = canEditNote(note);
                                const canDelete = canDeleteNote(note);

                                return (
                                    <TableRow key={note.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(note.record_date), 'MMM d, yyyy')}
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(note.record_date), 'h:mm a')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{note.title}</div>
                                        </TableCell>
                                        <TableCell>{note.provider_name}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    note.status === 'final' ? 'default' :
                                                        note.status === 'draft' ? 'secondary' :
                                                            'outline'
                                                }
                                            >
                                                {note.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Clock className="h-3 w-3" />
                                                <span className={
                                                    getTimeRemaining(note.created_at) === 'Expired'
                                                        ? 'text-red-600'
                                                        : 'text-green-600'
                                                }>
                                                    {getTimeRemaining(note.created_at)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => onViewNote(note)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>View Note</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleEdit(note)}
                                                                    disabled={!editCheck.allowed}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {editCheck.allowed
                                                                ? 'Edit Note'
                                                                : editCheck.reason}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                {canDelete && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete(note.id)}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Delete Note</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Info Box about 24-hour Edit Window */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-blue-900 mb-1">24-Hour Edit Window</h4>
                        <p className="text-sm text-blue-700">
                            Consult notes can only be edited within 24 hours of creation. After this period,
                            notes are locked to maintain medical record integrity. Administrators can edit notes at any time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
