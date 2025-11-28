
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Key, Save, Camera } from 'lucide-react';

const UserProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Dr. Jane Smith',
    role: 'EHR Administrator',
    email: 'jane.smith@archmedics.com',
    phone: '(555) 123-4567',
    department: 'Health Records',
    joinDate: 'January 15, 2023'
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Account</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Profile Settings</span>
          </div>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center border-4 border-white shadow">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-blue-500">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              {isEditing && (
                <label 
                  htmlFor="profile-image" 
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer shadow-lg"
                >
                  <Camera className="h-4 w-4 text-white" />
                  <input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <h3 className="text-xl font-bold">{userData.name}</h3>
            <p className="text-sm text-gray-500">{userData.role}</p>
            <div className="mt-4 w-full">
              <div className="flex items-center space-x-2 py-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{userData.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex">
                      <span className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0">
                        <User className="h-4 w-4 text-gray-500" />
                      </span>
                      <Input 
                        id="name"
                        value={userData.name} 
                        readOnly={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex">
                      <span className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0">
                        <Mail className="h-4 w-4 text-gray-500" />
                      </span>
                      <Input 
                        id="email"
                        type="email" 
                        value={userData.email} 
                        readOnly={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <span className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0">
                        <Phone className="h-4 w-4 text-gray-500" />
                      </span>
                      <Input 
                        id="phone"
                        value={userData.phone} 
                        readOnly={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department"
                      value={userData.department} 
                      readOnly={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                      onChange={(e) => setUserData({...userData, department: e.target.value})}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h4 className="font-medium">Security</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="flex">
                        <span className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0">
                          <Key className="h-4 w-4 text-gray-500" />
                        </span>
                        <Input 
                          id="current-password"
                          type="password" 
                          placeholder="••••••••" 
                          disabled={!isEditing}
                          className={isEditing ? "" : "bg-gray-50"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password"
                        type="password" 
                        placeholder="••••••••" 
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password"
                        type="password" 
                        placeholder="••••••••" 
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-gray-50"}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
