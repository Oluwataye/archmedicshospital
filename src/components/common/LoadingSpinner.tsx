import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    text?: string;
    className?: string;
}

export default function LoadingSpinner({ fullScreen = false, text, className = '' }: LoadingSpinnerProps) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                {text && <p className="mt-4 text-lg font-medium text-muted-foreground">{text}</p>}
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
        </div>
    );
}
