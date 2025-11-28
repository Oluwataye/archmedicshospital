"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var tabs_1 = require("@/components/ui/tabs");
var sonner_1 = require("sonner");
var AuthContext_1 = require("@/contexts/AuthContext");
var lucide_react_1 = require("lucide-react");
var ProfilePage = function () {
    var _a, _b;
    var _c = (0, AuthContext_1.useAuth)(), user = _c.user, updateProfile = _c.updateProfile;
    var _d = (0, react_1.useState)("personal"), activeTab = _d[0], setActiveTab = _d[1];
    var _e = (0, react_1.useState)({
        name: (user === null || user === void 0 ? void 0 : user.name) || '',
        email: (user === null || user === void 0 ? void 0 : user.email) || '',
        phone: (user === null || user === void 0 ? void 0 : user.phone) || '',
        role: (user === null || user === void 0 ? void 0 : user.role) || '',
        specialty: (user === null || user === void 0 ? void 0 : user.specialty) || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }), formData = _e[0], setFormData = _e[1];
    var handleInputChange = function (e) {
        var _a;
        var _b = e.target, name = _b.name, value = _b.value;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[name] = value, _a)));
    };
    var handleSavePersonalInfo = function (e) {
        e.preventDefault();
        // Here you would typically send the updated data to your backend
        updateProfile({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            specialty: formData.specialty
        });
        sonner_1.toast.success('Profile information updated successfully');
    };
    var handleChangePassword = function (e) {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            sonner_1.toast.error('New passwords do not match');
            return;
        }
        if (formData.newPassword.length < 8) {
            sonner_1.toast.error('Password must be at least 8 characters long');
            return;
        }
        // Here you would typically send the password update to your backend
        sonner_1.toast.success('Password changed successfully');
        // Reset password fields
        setFormData(__assign(__assign({}, formData), { currentPassword: '', newPassword: '', confirmPassword: '' }));
    };
    return (<div className="space-y-6">
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
        <card_1.Card>
          <card_1.CardContent className="flex flex-col items-center p-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
                {(user === null || user === void 0 ? void 0 : user.avatar) ? (<img src={user.avatar} alt={(user === null || user === void 0 ? void 0 : user.name) || 'User'} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-4xl">
                    {((_b = (_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.charAt(0)) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || 'U'}
                  </div>)}
              </div>
              <button_1.Button size="icon" className="absolute bottom-0 right-0 rounded-full" variant="outline">
                <lucide_react_1.Camera className="h-4 w-4"/>
              </button_1.Button>
            </div>
            <h2 className="text-xl font-semibold mt-2">{user === null || user === void 0 ? void 0 : user.name}</h2>
            <p className="text-gray-500">{(user === null || user === void 0 ? void 0 : user.role) || 'Staff'}</p>
            <div className="w-full bg-blue-50 rounded-md p-4 mt-6">
              <h3 className="font-medium text-gray-700 mb-2">Account Information</h3>
              <ul className="space-y-2">
                <li className="text-sm">
                  <span className="text-gray-500">Email: </span>
                  {user === null || user === void 0 ? void 0 : user.email}
                </li>
                <li className="text-sm">
                  <span className="text-gray-500">Phone: </span>
                  {(user === null || user === void 0 ? void 0 : user.phone) || 'Not provided'}
                </li>
                <li className="text-sm">
                  <span className="text-gray-500">Specialty: </span>
                  {(user === null || user === void 0 ? void 0 : user.specialty) || 'Not specified'}
                </li>
                <li className="text-sm">
                  <span className="text-gray-500">Staff ID: </span>
                  {(user === null || user === void 0 ? void 0 : user.id) || 'Unknown'}
                </li>
              </ul>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Profile Edit Tabs */}
        <card_1.Card className="md:col-span-2">
          <card_1.CardHeader>
            <card_1.CardTitle>Edit Profile</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
              <tabs_1.TabsList className="grid grid-cols-2 w-full mb-6">
                <tabs_1.TabsTrigger value="personal">Personal Information</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="security">Security</tabs_1.TabsTrigger>
              </tabs_1.TabsList>

              <tabs_1.TabsContent value="personal">
                <form onSubmit={handleSavePersonalInfo}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label_1.Label htmlFor="name">Full Name</label_1.Label>
                        <input_1.Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name"/>
                      </div>
                      <div>
                        <label_1.Label htmlFor="email">Email Address</label_1.Label>
                        <input_1.Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label_1.Label htmlFor="phone">Phone Number</label_1.Label>
                        <input_1.Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number"/>
                      </div>
                      <div>
                        <label_1.Label htmlFor="specialty">Specialty</label_1.Label>
                        <input_1.Input id="specialty" name="specialty" value={formData.specialty} onChange={handleInputChange} placeholder="Your specialty" disabled={(user === null || user === void 0 ? void 0 : user.role) !== 'doctor' && (user === null || user === void 0 ? void 0 : user.role) !== 'ehr'}/>
                      </div>
                    </div>

                    <div>
                      <label_1.Label htmlFor="role">Role</label_1.Label>
                      <input_1.Input id="role" name="role" value={formData.role} disabled className="bg-gray-100"/>
                      <p className="text-xs text-gray-500 mt-1">
                        Role can only be changed by an administrator.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button_1.Button type="submit" className="flex items-center">
                        <lucide_react_1.Save className="w-4 h-4 mr-2"/>
                        Save Changes
                      </button_1.Button>
                    </div>
                  </div>
                </form>
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="security">
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4">
                    <div className="flex items-center mb-4 p-2 bg-blue-50 rounded-md text-blue-700">
                      <lucide_react_1.Shield className="h-5 w-5 mr-2"/> 
                      <span className="text-sm">Update your password regularly to keep your account secure.</span>
                    </div>

                    <div>
                      <label_1.Label htmlFor="currentPassword">Current Password</label_1.Label>
                      <input_1.Input id="currentPassword" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleInputChange} placeholder="Enter current password"/>
                    </div>

                    <div>
                      <label_1.Label htmlFor="newPassword">New Password</label_1.Label>
                      <input_1.Input id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} placeholder="Enter new password"/>
                    </div>

                    <div>
                      <label_1.Label htmlFor="confirmPassword">Confirm New Password</label_1.Label>
                      <input_1.Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm new password"/>
                    </div>

                    <div className="flex justify-end">
                      <button_1.Button type="submit" className="flex items-center">
                        Save Password
                      </button_1.Button>
                    </div>
                  </div>
                </form>
              </tabs_1.TabsContent>
            </tabs_1.Tabs>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
};
exports.default = ProfilePage;
