import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Moon, Shield } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    const handleThemeChange = (checked: boolean) => {
        setTheme(checked ? 'dark' : 'light');
        toast.success(`Theme switched to ${checked ? 'dark' : 'light'} mode`);
    };

    const handleNotificationChange = (type: 'email' | 'push', checked: boolean) => {
        if (type === 'email') setEmailNotifications(checked);
        else setPushNotifications(checked);
        toast.success(`${type === 'email' ? 'Email' : 'Push'} notifications ${checked ? 'enabled' : 'disabled'}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your application preferences</p>
            </div>

            <div className="grid gap-6 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize how the application looks on your device</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <Label>Theme</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${theme === 'light'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <Moon className="h-6 w-6 rotate-180" />
                                    <span className="text-sm font-medium">Light</span>
                                </button>

                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${theme === 'dark'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <Moon className="h-6 w-6" />
                                    <span className="text-sm font-medium">Dark</span>
                                </button>

                                <button
                                    onClick={() => setTheme('system')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${theme === 'system'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <Moon className="h-6 w-6 opacity-50" />
                                    <span className="text-sm font-medium">System</span>
                                </button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Choose your preferred theme or let it match your system settings
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Configure how you receive alerts and notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-4">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive daily summaries via email</p>
                                </div>
                            </div>
                            <Switch
                                id="email-notifications"
                                checked={emailNotifications}
                                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-4">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <Label htmlFor="push-notifications">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive real-time alerts in the browser</p>
                                </div>
                            </div>
                            <Switch
                                id="push-notifications"
                                checked={pushNotifications}
                                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Manage your account security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-4">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                                </div>
                            </div>
                            <Button variant="outline">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-4">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <Label>Change Password</Label>
                                    <p className="text-sm text-muted-foreground">Update your password regularly</p>
                                </div>
                            </div>
                            <Button variant="outline">Update</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
