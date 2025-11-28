import React from 'react';
import { Calendar } from "@/components/ui/calendar";

const AppointmentCalendar: React.FC = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
        />
    );
};

export default AppointmentCalendar;
