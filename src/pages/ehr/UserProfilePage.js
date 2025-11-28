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
var separator_1 = require("@/components/ui/separator");
var use_toast_1 = require("@/hooks/use-toast");
var lucide_react_1 = require("lucide-react");
var UserProfilePage = function () {
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)(false), isEditing = _a[0], setIsEditing = _a[1];
    var _b = (0, react_1.useState)(null), profileImage = _b[0], setProfileImage = _b[1];
    // Mock user data
    var _c = (0, react_1.useState)({
        name: 'Dr. Jane Smith',
        role: 'EHR Administrator',
        email: 'jane.smith@archmedics.com',
        phone: '(555) 123-4567',
        department: 'Health Records',
        joinDate: 'January 15, 2023'
    }), userData = _c[0], setUserData = _c[1];
    var handleSaveProfile = function (e) {
        e.preventDefault();
        toast({
            title: "Profile updated",
            description: "Your profile information has been updated successfully."
        });
        setIsEditing(false);
    };
    var handleImageUpload = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                setProfileImage((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Account</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Profile Settings</span>
          </div>
        </div>
        {!isEditing && (<button_1.Button onClick={function () { return setIsEditing(true); }}>
            Edit Profile
          </button_1.Button>)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <card_1.Card className="md:col-span-1">
          <card_1.CardHeader>
            <card_1.CardTitle>Profile</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center border-4 border-white shadow">
                {profileImage ? (<img src={profileImage} alt="Profile" className="w-full h-full object-cover"/>) : (<span className="text-4xl font-bold text-blue-500">
                    {userData.name.split(' ').map(function (n) { return n[0]; }).join('')}
                  </span>)}
              </div>
              {isEditing && (<label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer shadow-lg">
                  <lucide_react_1.Camera className="h-4 w-4 text-white"/>
                  <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
                </label>)}
            </div>
            <h3 className="text-xl font-bold">{userData.name}</h3>
            <p className="text-sm text-gray-500">{userData.role}</p>
            <div className="mt-4 w-full">
              <div className="flex items-center space-x-2 py-2">
                <lucide_react_1.Mail className="h-4 w-4 text-gray-500"/>
                <span className="text-sm text-gray-700">{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <lucide_react_1.Phone className="h-4 w-4 text-gray-500"/>
                <span className="text-sm text-gray-700">{userData.phone}</span>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Profile Information Card */}
        <card_1.Card className="md:col-span-2">
          <card_1.CardHeader>
            <card_1.CardTitle>Account Information</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label_1.Label htmlFor="name">Full Name</label_1.Label>
                    <div className="flex">
                      <span className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0">
                        <lucide_react_1.User className="h-4 w-4 text-gray-500"/>
                      </span>
                      <input_1.Input id="name" value={userData.name} readOnly={!isEditing} className={isEditing ? "" : "bg-gray-50"} onChange={function (e) { return setUserData(__assign(__assign({}, userData), { name: e.target.value })); }}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label_1.Label htmlFor="email">Email</label_1.Label>
                    <div className="flex">
                      <span className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0">
                        <lucide_react_1.Mail className="h-4 w-4 text-gray-500"/>
                      </span>
                      <input_1.Input id="email" type="email" value={userData.email} readOnly={!isEditing} className={isEditing ? "" : "bg-gray-50"} onChange={function (e) { return setUserData(__assign(__assign({}, userData), { email: e.target.value })); }}/>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label_1.Label htmlFor="phone">Phone Number</label_1.Label>
                    <div className="flex">
                      <span className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0">
                        <lucide_react_1.Phone className="h-4 w-4 text-gray-500"/>
                      </span>
                      <input_1.Input id="phone" value={userData.phone} readOnly={!isEditing} className={isEditing ? "" : "bg-gray-50"} onChange={function (e) { return setUserData(__assign(__assign({}, userData), { phone: e.target.value })); }}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label_1.Label htmlFor="department">Department</label_1.Label>
                    <input_1.Input id="department" value={userData.department} readOnly={!isEditing} className={isEditing ? "" : "bg-gray-50"} onChange={function (e) { return setUserData(__assign(__assign({}, userData), { department: e.target.value })); }}/>
                  </div>
                </div>

                <separator_1.Separator className="my-4"/>

                <div className="space-y-2">
                  <h4 className="font-medium">Security</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label_1.Label htmlFor="current-password">Current Password</label_1.Label>
                      <div className="flex">
                        <span className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0">
                          <lucide_react_1.Key className="h-4 w-4 text-gray-500"/>
                        </span>
                        <input_1.Input id="current-password" type="password" placeholder="••••••••" disabled={!isEditing} className={isEditing ? "" : "bg-gray-50"}/>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label_1.Label htmlFor="new-password">New Password</label_1.Label>
                      <input_1.Input id="new-password" type="password" placeholder="••••••••" disabled={!isEditing} className={isEditing ? "" : "bg-gray-50"}/>
                    </div>
                    <div className="space-y-2">
                      <label_1.Label htmlFor="confirm-password">Confirm Password</label_1.Label>
                      <input_1.Input id="confirm-password" type="password" placeholder="••••••••" disabled={!isEditing} className={isEditing ? "" : "bg-gray-50"}/>
                    </div>
                  </div>
                </div>

                {isEditing && (<div className="flex justify-end space-x-2 mt-6">
                    <button_1.Button type="button" variant="outline" onClick={function () { return setIsEditing(false); }}>
                      Cancel
                    </button_1.Button>
                    <button_1.Button type="submit" className="flex items-center gap-2">
                      <lucide_react_1.Save className="h-4 w-4"/>
                      Save Changes
                    </button_1.Button>
                  </div>)}
              </div>
            </form>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
};
exports.default = UserProfilePage;
