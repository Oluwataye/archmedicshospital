import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Activity, Users, TrendingUp } from "lucide-react";

interface PatientStatisticsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PatientStatisticsModal: React.FC<PatientStatisticsModalProps> = ({ open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Patient Statistics & Analytics</DialogTitle>
                    <div className="sr-only">
                        <p id="stats-desc">Detailed analytics and statistics for patient admissions and demographics.</p>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="demographics">Demographics</TabsTrigger>
                        <TabsTrigger value="trends">Admission Trends</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Admissions</CardTitle>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1,234</div>
                                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg. Length of Stay</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">4.2 Days</div>
                                    <p className="text-xs text-muted-foreground">-0.5 days from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Readmission Rate</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12%</div>
                                    <p className="text-xs text-muted-foreground">+2% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">85%</div>
                                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>Admissions by Department</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">General Medicine</span>
                                            <span className="text-sm text-muted-foreground">45%</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[45%]" />
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-sm font-medium">Surgery</span>
                                            <span className="text-sm text-muted-foreground">25%</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[25%]" />
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-sm font-medium">Pediatrics</span>
                                            <span className="text-sm text-muted-foreground">20%</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[20%]" />
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-sm font-medium">Orthopedics</span>
                                            <span className="text-sm text-muted-foreground">10%</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[10%]" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>Patient Demographics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center items-center h-[200px] text-muted-foreground">
                                        Chart Placeholder (Requires Recharts)
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="demographics">
                        <div className="flex justify-center items-center h-[300px] border rounded-md bg-slate-50">
                            <p className="text-muted-foreground">Detailed demographics analytics coming soon</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="trends">
                        <div className="flex justify-center items-center h-[300px] border rounded-md bg-slate-50">
                            <p className="text-muted-foreground">Admission trends analytics coming soon</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

function Clock(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

export default PatientStatisticsModal;
