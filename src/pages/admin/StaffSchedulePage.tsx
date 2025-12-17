
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, startOfWeek, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Clock, User, Check, ChevronsUpDown } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const StaffSchedulePage = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [schedules, setSchedules] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]); // For assigning
    const [loading, setLoading] = useState(true);
    const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);

    const [formData, setFormData] = useState({
        user_id: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '08:00',
        end_time: '16:00',
        shift_type: 'Morning',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch users for dropdown
            const usersRes = await fetch('http://localhost:3001/api/users', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (usersRes.ok) setUsers(await usersRes.json());

            // Fetch schedules (mocked endpoint logic if not ready, but we made routes)
            // Wait, I didn't enable /api/staff endpoints in index.ts yet, I only created the file.
            // I need to use the full path or wait for index.ts update. 
            // Assuming index.ts will be updated in next step or valid via 'schedules' route if generalized. 
            // Actually, I defined /api/users/schedules in user routes? No, staff.routes.ts has /schedules

            // I'll fetch assuming I'll mount staff.routes at /api/staff
            const scheduleRes = await fetch('http://localhost:3001/api/staff/schedules', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (scheduleRes.ok) setSchedules(await scheduleRes.json());

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddShift = async () => {
        try {
            const startDateTime = `${formData.date}T${formData.start_time}:00`;
            const endDateTime = `${formData.date}T${formData.end_time}:00`;

            const response = await fetch('http://localhost:3001/api/staff/schedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    user_id: formData.user_id,
                    start_time: startDateTime,
                    end_time: endDateTime,
                    shift_type: formData.shift_type,
                    notes: formData.notes
                })
            });

            if (response.ok) {
                toast.success('Shift added successfully');
                setIsAddShiftOpen(false);
                fetchData();
            } else {
                toast.error('Failed to add shift');
            }
        } catch (error) {
            toast.error('Error adding shift');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="flex h-[calc(100vh-100px)] gap-4">
            <div className="w-80 flex-shrink-0 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>

            </div>

            <div className="flex-1 space-y-4 overflow-auto">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        Schedule for {date ? format(date, 'MMMM do, yyyy') : 'Selected Date'}
                    </h2>
                    <Button onClick={() => setIsAddShiftOpen(true)}>
                        Add Shift
                    </Button>
                </div>

                <div className="grid gap-4">
                    {schedules.filter(s => date && new Date(s.start_time).toDateString() === date.toDateString()).length === 0 ? (
                        <div className="text-center p-10 text-gray-500 bg-white rounded-lg border">
                            No shifts scheduled for this day.
                        </div>
                    ) : (
                        schedules
                            .filter(s => date && new Date(s.start_time).toDateString() === date.toDateString())
                            .map(schedule => (
                                <Card key={schedule.id}>
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {schedule.firstName?.[0]}{schedule.lastName?.[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{schedule.firstName} {schedule.lastName}</h3>
                                                <div className="flex items-center text-sm text-gray-500 gap-2">
                                                    <Badge variant="secondary">{schedule.role}</Badge>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {format(new Date(schedule.start_time), 'HH:mm')} - {format(new Date(schedule.end_time), 'HH:mm')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Badge>{schedule.shift_type}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                    )}
                </div>
            </div>

            <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Shift</DialogTitle>
                        <div className="text-sm text-muted-foreground">
                            Fill in the details below to assign a new shift to a staff member.
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Staff Member</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !formData.user_id && "text-muted-foreground"
                                        )}
                                    >
                                        {formData.user_id
                                            ? users.find((u) => u.id === formData.user_id)?.firstName + " " + users.find((u) => u.id === formData.user_id)?.lastName
                                            : "Select staff"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search staff..." />
                                        <CommandList>
                                            <CommandEmpty>No staff found.</CommandEmpty>
                                            <CommandGroup>
                                                {users.map((u) => (
                                                    <CommandItem
                                                        value={u.firstName + " " + u.lastName + " " + u.role} // Enable searching by name or role
                                                        key={u.id}
                                                        onSelect={() => {
                                                            setFormData({ ...formData, user_id: u.id })
                                                            // Close popover logic would go here if we had state for it, but for now this sets value. 
                                                            // Ideally we should managing open state.
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                u.id === formData.user_id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {u.firstName} {u.lastName} ({u.role})
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Shift Type</Label>
                                <Select onValueChange={val => setFormData({ ...formData, shift_type: val })}>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Morning">Morning</SelectItem>
                                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                                        <SelectItem value="Night">Night</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Input type="time" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>End Time</Label>
                                <Input type="time" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Input value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddShiftOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddShift}>Add Shift</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StaffSchedulePage;
