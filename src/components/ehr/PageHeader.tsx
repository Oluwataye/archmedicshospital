import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
    title?: string;
    onNewRecordClick?: () => void;
    actionLabel?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title = "Patient Records",
    onNewRecordClick,
    actionLabel = "New Record"
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-1">Manage and view patient medical records and history.</p>
            </div>
            {onNewRecordClick && (
                <Button onClick={onNewRecordClick} className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default PageHeader;
