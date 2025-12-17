/**
 * Service Search Combobox Component
 * Responsive autocomplete for service selection
 * Triggers search after 3 characters
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Check, ChevronsUpDown, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useServiceSearch } from '@/hooks/useServicesQuery';
import { useDebounce } from '@/hooks/useDebounce';
import { Service, ServiceFilters } from '@/types/service';

interface ServiceSearchComboboxProps {
    value?: Service | null;
    onSelect: (service: Service | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    showPrice?: boolean;
    items?: Service[]; // Optional: Pass local items to search
    filters?: ServiceFilters; // Optional: Filters for remote search
}

export function ServiceSearchCombobox({
    value,
    onSelect,
    placeholder = 'Search services...',
    disabled = false,
    className,
    showPrice = true,
    items,
    filters,
}: ServiceSearchComboboxProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Debounce search query
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Determine data source
    const useRemoteSearch = !items;

    // Remote Search
    const { data: remoteServices = [], isLoading: isLoadingRemote } = useServiceSearch(
        useRemoteSearch ? debouncedSearch : '',
        filters
    );

    // Local Search
    const localServices = React.useMemo(() => {
        if (!items || !debouncedSearch || debouncedSearch.length < 3) return [];
        const query = debouncedSearch.toLowerCase();
        return items.filter(service =>
            service.name?.toLowerCase().includes(query) ||
            service.code?.toLowerCase().includes(query)
        );
    }, [items, debouncedSearch]);

    const services = useRemoteSearch ? remoteServices : localServices;
    const isLoading = useRemoteSearch ? isLoadingRemote : false;

    // Show hint when less than 3 characters
    const showHint = searchQuery.length > 0 && searchQuery.length < 3;
    const showResults = debouncedSearch.length >= 3;

    const handleSelect = useCallback((service: Service) => {
        onSelect(service);
        setOpen(false);
        setSearchQuery('');
    }, [onSelect]);

    const handleClear = useCallback(() => {
        onSelect(null);
        setSearchQuery('');
    }, [onSelect]);

    const formatPrice = useCallback((price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        'w-full justify-between',
                        !value && 'text-muted-foreground',
                        className
                    )}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Search className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                            {value ? (
                                <span className="flex items-center gap-2">
                                    <span className="font-medium">{value.name}</span>
                                    {showPrice && value.price && (
                                        <span className="text-xs text-muted-foreground">
                                            ({formatPrice(value.price)})
                                        </span>
                                    )}
                                </span>
                            ) : (
                                placeholder
                            )}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Type at least 3 characters to search..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        {showHint && (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                                Type {3 - searchQuery.length} more character{3 - searchQuery.length !== 1 ? 's' : ''} to search...
                            </div>
                        )}

                        {isLoading && showResults && (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm text-muted-foreground">Searching...</span>
                            </div>
                        )}

                        {!isLoading && showResults && services.length === 0 && (
                            <CommandEmpty>
                                No services found matching "{debouncedSearch}"
                            </CommandEmpty>
                        )}

                        {!isLoading && showResults && services.length > 0 && (
                            <CommandGroup heading={`${services.length} service${services.length !== 1 ? 's' : ''} found`}>
                                {services.map((service) => (
                                    <CommandItem
                                        key={service.id}
                                        value={service.id.toString()}
                                        onSelect={() => handleSelect(service)}
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value?.id === service.id ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-medium truncate">{service.name}</span>
                                                {showPrice && service.price && (
                                                    <span className="text-sm font-semibold text-primary shrink-0">
                                                        {formatPrice(service.price)}
                                                    </span>
                                                )}
                                            </div>
                                            {(service.code || service.category) && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    {service.code && (
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            {service.code}
                                                        </span>
                                                    )}
                                                    {service.category && (
                                                        <span className="text-xs text-muted-foreground">
                                                            • {service.category}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {!showHint && !showResults && (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                                Start typing to search for services...
                            </div>
                        )}
                    </CommandList>
                </Command>

                {value && (
                    <div className="border-t p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="w-full"
                        >
                            Clear Selection
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
