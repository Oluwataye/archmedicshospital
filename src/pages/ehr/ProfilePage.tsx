
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Save, Shield } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    specialty: user?.specialty || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the updated data to your backend
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialty: formData.specialty
    });
    
    toast.success('Profile information updated successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    // Here you would typically send the password update to your backend
    toast.success('Password changed successfully');
    
    // Reset password fields
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
        <div className="text-sm text-gray-500 flex items-center mt-1">
          <span>Settings</span>
          <span className="mx-2">›</span>
          <span className="text-blue-500">Your Profile</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user?.name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-4xl">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <Button 
                size="icon" 
                className="absolute bottom-0 right-0 rounded-full"
                variant="outline"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold mt-2">{user?.name}</h2>
            <p className="text-gray-500">{user?.role || 'Staff'}</p>
            <div className="w-full bg-blue-50 rounded-md p-4 mt-6">
              <h3 className="font-medium text-gray-700 mb-2">Account Information</h3>
              <ul className="space-y-2">
                <li className="text-sm">
                  <span className="text-gray-500">Email: </span>
                  {user?.email}
                </li>
                <li className="text-sm">
                  <span className="text-gray-500">Phone: </span>
                  {user?.phone || 'Not provided'}
                </li>
                <li className="text-sm">
                  <span className="text-gray-500">Specialty: </span>
                  {user?.specialty || 'Not specified'}
                </li>
                <li className="text-sm">
                  <span className="text-gray-500">Staff ID: </span>
                  {user?.id || 'Unknown'}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Profile Edit Tabs */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <form onSubmit={handleSavePersonalInfo}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input 
                          id="specialty" 
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleInputChange}
                          placeholder="Your specialty"
                          disabled={user?.role !== 'doctor' && user?.role !== 'ehr'} 
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        name="role"
                        value={formData.role}
                        disabled 
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Role can only be changed by an administrator.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="flex items-center">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="security">
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4">
                    <div className="flex items-center mb-4 p-2 bg-blue-50 rounded-md text-blue-700">
                      <Shield className="h-5 w-5 mr-2" /> 
                      <span className="text-sm">Update your password regularly to keep your account secure.</span>
                    </div>

                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter current password" 
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password" 
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password" 
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="flex items-center">
                        Save Password
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
