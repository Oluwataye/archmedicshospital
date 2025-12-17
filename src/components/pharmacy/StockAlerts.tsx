import React from 'react';
import { AlertTriangle, Clock, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LowStockItem {
    id: string;
    name: string;
    current_stock: number;
    reorder_level: number;
    unit_measure: string;
}

interface ExpiringBatch {
    id: string;
    batch_number: string;
    expiry_date: string;
    remaining_quantity: number;
    item_name: string;
    item_id: string;
}

interface StockAlertsProps {
    lowStock: LowStockItem[];
    expiringBatches: ExpiringBatch[];
    onRestock: (item: LowStockItem) => void;
}

export default function StockAlerts({ lowStock, expiringBatches, onRestock }: StockAlertsProps) {
    if (lowStock.length === 0 && expiringBatches.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 mb-6">
            {/* Low Stock Alerts */}
            <Card className="border-red-200 bg-red-50/50">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-red-700 text-lg">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Low Stock Alerts ({lowStock.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-3">
                            {lowStock.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-red-600">
                                            Stock: {item.current_stock} {item.unit_measure} (Reorder: {item.reorder_level})
                                        </p>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => onRestock(item)}>
                                        Restock
                                    </Button>
                                </div>
                            ))}
                            {lowStock.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No low stock items.</p>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Expiry Alerts */}
            <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-orange-700 text-lg">
                        <Clock className="mr-2 h-5 w-5" />
                        Expiring Soon ({expiringBatches.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-3">
                            {expiringBatches.map((batch) => {
                                const daysUntilExpiry = Math.ceil((new Date(batch.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                return (
                                    <div key={batch.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-100 shadow-sm">
                                        <div>
                                            <p className="font-medium text-gray-900">{batch.item_name}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Badge variant="outline" className="text-xs">{batch.batch_number}</Badge>
                                                <span>Qty: {batch.remaining_quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${daysUntilExpiry < 30 ? 'text-red-600' : 'text-orange-600'}`}>
                                                {daysUntilExpiry} days
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(batch.expiry_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {expiringBatches.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No expiring batches.</p>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
