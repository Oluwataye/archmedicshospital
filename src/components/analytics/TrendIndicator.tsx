import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
    value: number;
    showPercentage?: boolean;
    className?: string;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({
    value,
    showPercentage = true,
    className
}) => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    const isNeutral = value === 0;

    const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

    const colorClass = isPositive
        ? 'text-green-600'
        : isNegative
            ? 'text-red-600'
            : 'text-gray-500';

    const bgClass = isPositive
        ? 'bg-green-50'
        : isNegative
            ? 'bg-red-50'
            : 'bg-gray-50';

    return (
        <div className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', bgClass, colorClass, className)}>
            <Icon className="h-3 w-3" />
            {showPercentage && (
                <span>
                    {isPositive && '+'}
                    {value.toFixed(1)}%
                </span>
            )}
        </div>
    );
};

export default TrendIndicator;
