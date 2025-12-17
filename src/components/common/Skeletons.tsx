/**
 * Common UI Components - Table Skeleton
 * Loading skeleton for tables
 */

import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-12 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

interface CardSkeletonProps {
    count?: number;
}

export function CardSkeleton({ count = 4 }: CardSkeletonProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="space-y-3 p-6 border rounded-lg">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-full" />
                </div>
            ))}
        </div>
    );
}
