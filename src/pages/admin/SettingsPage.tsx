import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Settings as SettingsIcon, Download, FileJson, FileSpreadsheet, Building2, Moon, Bell, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useHospitalSettings } from '@/contexts/HospitalSettingsContext';
import { useTheme } from '@/contexts/ThemeContext';

interface Setting {
    id: string;
    key: string;
    value: string;
    category: string;
    data_type: string;
    description: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingHospital, setSavingHospital] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [backups, setBackups] = useState<any[]>([]);
    const { settings: hospitalSettings, refreshSettings } = useHospitalSettings();

    // Hospital information form state
    const [hospitalForm, setHospitalForm] = useState({
        hospital_name: '',
        address: '',
        phone: '',
        email: ''
    });

    // Logo upload state
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    // Favicon upload state
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);

    useEffect(() => {
        loadSettings();
        loadBackups();
        loadHospitalSettings();
    }, []);

    // Load hospital settings into form
    useEffect(() => {
        if (hospitalSettings) {
            setHospitalForm({
                hospital_name: hospitalSettings.hospital_name || '',
                address: hospitalSettings.address || '',
                phone: hospitalSettings.phone || '',
                email: hospitalSettings.email || ''
            });
        }
    }, [hospitalSettings]);

    const loadBackups = async () => {
        try {
            const data = await ApiService.getAutomaticBackups();
            setBackups(data);
        } catch (error) {
            console.error('Error loading backups:', error);
        }
    };

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getSettings();
            setSettings(data);

            // Initialize form data
            const initialData: Record<string, string> = {};
            data.forEach((setting: Setting) => {
                initialData[setting.key] = setting.value;
            });
            setFormData(initialData);
        } catch (error) {
            console.error('Error loading settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const loadHospitalSettings = async () => {
        try {
            const data = await ApiService.getHospitalSettings();
            setHospitalForm({
                hospital_name: data.hospital_name || '',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || ''
            });
        } catch (error) {
            console.error('Error loading hospital settings:', error);
        }
    };

    const handleHospitalChange = (field: string, value: string) => {
        setHospitalForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveHospitalSettings = async () => {
        try {
            setSavingHospital(true);
            await ApiService.updateHospitalSettings(hospitalForm);
            await refreshSettings(); // Refresh global context
            toast.success('Hospital information updated successfully');
        } catch (error) {
            console.error('Error saving hospital settings:', error);
            toast.error('Failed to save hospital information');
        } finally {
            setSavingHospital(false);
        }
    };

    // Generate abbreviation preview
    const generateAbbreviationPreview = (name: string): string => {
        if (!name) return 'XXX';
        const words = name.toUpperCase().replace(/[^A-Z\s]/g, '').split(/\s+/).filter(w => w.length > 0);
        if (words.length >= 3) {
            return words.slice(0, 3).map(w => w[0]).join('');
        }
        const allLetters = words.join('');
        const consonants = allLetters.replace(/[AEIOU]/g, '');
        if (consonants.length >= 3) {
            return consonants.substring(0, 3);
        }
        return allLetters.substring(0, 3).padEnd(3, 'X');
    };

    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Only PNG, JPG, and SVG are allowed.');
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB');
            return;
        }

        setLogoFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadLogo = async () => {
        if (!logoFile) {
            toast.error('Please select a logo file first');
            return;
        }

        try {
            setUploadingLogo(true);
            const result = await ApiService.uploadHospitalLogo(logoFile);
            await refreshSettings(); // Refresh global context
            toast.success('Logo uploaded successfully');
            setLogoFile(null);
            setLogoPreview(null);
            // Reload page to ensure logo displays
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast.error('Failed to upload logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleRemoveLogo = async () => {
        try {
            setUploadingLogo(true);
            await ApiService.deleteHospitalLogo();
            await refreshSettings(); // Refresh global context
            toast.success('Logo removed successfully');
            setLogoFile(null);
            setLogoPreview(null);
        } catch (error) {
            console.error('Error removing logo:', error);
            toast.error('Failed to remove logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleFaviconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Only PNG and ICO files are allowed for favicon.');
            return;
        }

        if (file.size > 500 * 1024) {
            toast.error('File size must be less than 500KB');
            return;
        }

        setFaviconFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setFaviconPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleUploadFavicon = async () => {
        if (!faviconFile) {
            toast.error('Please select a favicon file first');
            return;
        }

        try {
            setUploadingFavicon(true);
            await ApiService.uploadFavicon(faviconFile);
            toast.success('Favicon uploaded! Refresh your browser to see the new icon.');
            setFaviconFile(null);
            setFaviconPreview(null);
        } catch (error) {
            console.error('Error uploading favicon:', error);
            toast.error('Failed to upload favicon');
        } finally {
            setUploadingFavicon(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Prepare settings for bulk update
            const settingsToUpdate = Object.entries(formData).map(([key, value]) => ({
                key,
                value
            }));

            await ApiService.bulkUpdateSettings(settingsToUpdate);
            toast.success('Settings saved successfully');
            loadSettings();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async (type: string, isFullBackup: boolean = false) => {
        try {
            const response = isFullBackup
                ? await ApiService.downloadFullBackup()
                : await ApiService.downloadCSVExport(type);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = response.headers['content-disposition']?.split('filename=')[1] || (isFullBackup ? 'backup.json' : 'export.csv');
            link.setAttribute('download', filename.replace(/"/g, ''));
            document.body.appendChild(link);
            link.click();
            link.remove();
            link.click();
            link.remove();
            toast.success('Download started successfully');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download backup');
        }
    };

    const handleDownloadAutomatic = async (filename: string) => {
        try {
            const response = await ApiService.downloadAutomaticBackup(filename);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Download started successfully');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download backup');
        }
    };

    const getSettingsByCategory = (category: string) => {
        return settings.filter(s => s.category === category);
    };

    const renderSettingInput = (setting: Setting) => {
        const value = formData[setting.key] || '';

        switch (setting.data_type) {
            case 'boolean':
                return (
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>{setting.description}</Label>
                        </div>
                        <Switch
                            checked={value === 'true'}
                            onCheckedChange={(checked) => handleChange(setting.key, checked.toString())}
                        />
                    </div>
                );

            case 'number':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.description}</Label>
                        <Input
                            id={setting.key}
                            type="number"
                            value={value}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                        />
                    </div>
                );

            default:
                return (
                    <div className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.description}</Label>
                        <Input
                            id={setting.key}
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                        />
                    </div>
                );
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground mt-1">Configure system-wide settings and preferences</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadSettings}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="hospital" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="hospital">Hospital Information</TabsTrigger>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="backup">Backup</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="hospital" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Hospital Information
                            </CardTitle>
                            <CardDescription>
                                Configure your hospital's branding and contact information. This information will appear on receipts, reports, and throughout the system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="hospital_name">Hospital Name *</Label>
                                <Input
                                    id="hospital_name"
                                    value={hospitalForm.hospital_name}
                                    onChange={(e) => handleHospitalChange('hospital_name', e.target.value)}
                                    placeholder="e.g., Central City Hospital"
                                />
                                <p className="text-sm text-muted-foreground">
                                    This name will appear on all official documents and throughout the system.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Hospital Logo</Label>
                                <div className="flex flex-col gap-4">
                                    {hospitalSettings?.logo_url && !logoPreview && (
                                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                                            <img
                                                src="/api/hospital-settings/logo"
                                                alt="Current Hospital Logo"
                                                className="h-20 w-20 object-contain bg-white p-2 rounded"
                                                onError={(e) => {
                                                    console.error('Logo failed to load:', hospitalSettings.logo_url);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">Current Logo</p>
                                                <p className="text-sm text-muted-foreground">Appears in sidebar, login page, and receipts</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRemoveLogo}
                                                disabled={uploadingLogo}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}

                                    {logoPreview && (
                                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                                            <img
                                                src={logoPreview}
                                                alt="Logo Preview"
                                                className="h-20 w-20 object-contain"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">Preview</p>
                                                <p className="text-sm text-muted-foreground">{logoFile?.name}</p>
                                            </div>
                                            <Button
                                                onClick={handleUploadLogo}
                                                disabled={uploadingLogo}
                                                size="sm"
                                            >
                                                {uploadingLogo ? 'Uploading...' : 'Upload'}
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                            onChange={handleLogoFileChange}
                                            disabled={uploadingLogo}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Recommended: Square image (200x200px), PNG or JPG, max 2MB
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Browser Favicon (Tab Icon)</Label>
                                <div className="flex flex-col gap-4">
                                    {faviconPreview && (
                                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                                            <img
                                                src={faviconPreview}
                                                alt="Favicon Preview"
                                                className="h-8 w-8"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">Preview</p>
                                                <p className="text-sm text-muted-foreground">{faviconFile?.name}</p>
                                            </div>
                                            <Button
                                                onClick={handleUploadFavicon}
                                                disabled={uploadingFavicon}
                                                size="sm"
                                            >
                                                {uploadingFavicon ? 'Uploading...' : 'Apply Favicon'}
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="file"
                                            accept="image/png,image/x-icon"
                                            onChange={handleFaviconFileChange}
                                            disabled={uploadingFavicon}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Upload a 32x32px PNG or ICO file (max 500KB). Refresh browser to see changes.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Hospital Abbreviation (Auto-generated)</Label>
                                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-lg font-bold text-primary">
                                            {generateAbbreviationPreview(hospitalForm.hospital_name)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{generateAbbreviationPreview(hospitalForm.hospital_name)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            This 3-letter code will be used in patient IDs and sidebar branding
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Example patient ID: <code className="px-1 py-0.5 bg-muted rounded">{generateAbbreviationPreview(hospitalForm.hospital_name)}-000001-24</code>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Hospital Address</Label>
                                <Textarea
                                    id="address"
                                    value={hospitalForm.address}
                                    onChange={(e) => handleHospitalChange('address', e.target.value)}
                                    placeholder="e.g., 123 Medical Center Drive, Lagos, Nigeria"
                                    rows={3}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Full address including city and country. Appears on receipts and reports.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Contact Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={hospitalForm.phone}
                                        onChange={(e) => handleHospitalChange('phone', e.target.value)}
                                        placeholder="e.g., +234-XXX-XXX-XXXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Official Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={hospitalForm.email}
                                        onChange={(e) => handleHospitalChange('email', e.target.value)}
                                        placeholder="e.g., info@hospital.com"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <Button onClick={handleSaveHospitalSettings} disabled={savingHospital || !hospitalForm.hospital_name}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {savingHospital ? 'Saving...' : 'Save Hospital Information'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Preferences</CardTitle>
                            <CardDescription>
                                Configure system-wide preferences and application behavior (Hospital branding is in the "Hospital Information" tab)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {getSettingsByCategory('general').map(setting => (
                                <div key={setting.id}>
                                    {renderSettingInput(setting)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Configure password policies and security requirements
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {getSettingsByCategory('security').map(setting => (
                                <div key={setting.id}>
                                    {renderSettingInput(setting)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="backup" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Backup & Restore</CardTitle>
                            <CardDescription>
                                Download full system backup or export specific data sets
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <FileJson className="h-4 w-4 text-primary" />
                                        Full System Backup
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Download a complete JSON backup of the entire database for restoration purposes.
                                    </p>
                                </div>
                                <Button onClick={() => handleDownload('full', true)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Backup
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium flex items-center gap-2">
                                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                    Data Export (CSV)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button variant="outline" className="justify-start" onClick={() => handleDownload('patients')}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Patients List
                                    </Button>
                                    <Button variant="outline" className="justify-start" onClick={() => handleDownload('transactions')}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Transactions
                                    </Button>
                                    <Button variant="outline" className="justify-start" onClick={() => handleDownload('inventory')}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Inventory
                                    </Button>
                                    <Button variant="outline" className="justify-start" onClick={() => handleDownload('users')}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export Users List
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Automatic Backups</CardTitle>
                            <CardDescription>
                                List of automatically generated system backups available for download
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {backups.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground">
                                    No automatic backups found.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {backups.map((backup, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                                    <FileJson className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{backup.filename}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(backup.date).toLocaleString()} • {(backup.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => handleDownloadAutomatic(backup.filename)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Automatic Backup Settings</CardTitle>
                            <CardDescription>
                                Configure automatic backup schedules and retention policies
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {getSettingsByCategory('backup').map(setting => (
                                <div key={setting.id}>
                                    {setting.key === 'backup_frequency' ? (
                                        <div className="space-y-2">
                                            <Label htmlFor={setting.key}>{setting.description}</Label>
                                            <Select
                                                value={formData[setting.key]}
                                                onValueChange={(value) => handleChange(setting.key, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="daily">Daily</SelectItem>
                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : (
                                        renderSettingInput(setting)
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>



                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>
                                Configure email and SMS notification preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {getSettingsByCategory('notifications').map(setting => (
                                <div key={setting.id}>
                                    {renderSettingInput(setting)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
