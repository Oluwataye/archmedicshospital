"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedDashboard = EnhancedDashboard;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var defaultStats = {
    totalPatients: 1247,
    patientsGrowth: '+12%',
    appointmentsToday: 24,
    pendingAppointments: 6,
    labTests: 58,
    criticalResults: 3,
    revenueToday: 12450,
    revenueGrowth: '+8%'
};
function EnhancedDashboard(_a) {
    var _b = _a.stats, stats = _b === void 0 ? defaultStats : _b, _c = _a.userRole, userRole = _c === void 0 ? 'EHR Manager' : _c, _d = _a.userName, userName = _d === void 0 ? 'Dr. Smith' : _d;
    return (<div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ARCHMEDICS HMS</h1>
          <p className="text-gray-600">Enhanced Dashboard - Welcome, {userName}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button_1.Button variant="outline" size="sm" className="hover:bg-gray-100">
            <lucide_react_1.Bell className="w-4 h-4 mr-2"/>
            Notifications
          </button_1.Button>
          <button_1.Button variant="outline" size="sm" className="hover:bg-gray-100">
            <lucide_react_1.Settings className="w-4 h-4 mr-2"/>
            Settings
          </button_1.Button>
          <button_1.Button variant="outline" size="sm" className="hover:bg-gray-100">
            <lucide_react_1.User className="w-4 h-4 mr-2"/>
            Profile
          </button_1.Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <card_1.Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <lucide_react_1.TrendingUp className="w-3 h-3 mr-1"/>
                  {stats.patientsGrowth} from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <lucide_react_1.Users className="w-6 h-6 text-blue-600"/>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.appointmentsToday}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <lucide_react_1.Calendar className="w-3 h-3 mr-1"/>
                  {stats.pendingAppointments} pending
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <lucide_react_1.Calendar className="w-6 h-6 text-green-600"/>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lab Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.labTests}</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <lucide_react_1.AlertTriangle className="w-3 h-3 mr-1"/>
                  {stats.criticalResults} critical
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <lucide_react_1.TestTube className="w-6 h-6 text-amber-600"/>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenueToday.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <lucide_react_1.TrendingUp className="w-3 h-3 mr-1"/>
                  {stats.revenueGrowth} from yesterday
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <lucide_react_1.CreditCard className="w-6 h-6 text-purple-600"/>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Quick Actions Section */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center">
            <lucide_react_1.Activity className="w-5 h-5 mr-2 text-blue-600"/>
            Quick Actions
          </card_1.CardTitle>
          <card_1.CardDescription>
            Frequently used actions for {userRole}
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button_1.Button className="h-20 flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
              <lucide_react_1.Plus className="w-5 h-5"/>
              <span className="text-sm">Add Patient</span>
            </button_1.Button>
            <button_1.Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-gray-50">
              <lucide_react_1.Calendar className="w-5 h-5"/>
              <span className="text-sm">Schedule</span>
            </button_1.Button>
            <button_1.Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-gray-50">
              <lucide_react_1.TestTube className="w-5 h-5"/>
              <span className="text-sm">Lab Order</span>
            </button_1.Button>
            <button_1.Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-gray-50">
              <lucide_react_1.Activity className="w-5 h-5"/>
              <span className="text-sm">Vitals</span>
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Recent Activity Section */}
      <card_1.Card>
        <card_1.CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <card_1.CardTitle>Recent Activity</card_1.CardTitle>
              <card_1.CardDescription>Latest updates and notifications</card_1.CardDescription>
            </div>
            <button_1.Button variant="outline" size="sm">
              View All
            </button_1.Button>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <lucide_react_1.Users className="w-4 h-4 text-blue-600"/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New patient registered</p>
                <p className="text-xs text-gray-500">John Doe (P-10248) - 2 minutes ago</p>
              </div>
              <badge_1.Badge variant="secondary">New</badge_1.Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg">
              <div className="p-2 bg-red-100 rounded-full">
                <lucide_react_1.AlertTriangle className="w-4 h-4 text-red-600"/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Critical lab result</p>
                <p className="text-xs text-gray-500">Troponin I - Patient: Emily Davis - 5 minutes ago</p>
              </div>
              <badge_1.Badge variant="destructive">Critical</badge_1.Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <lucide_react_1.Calendar className="w-4 h-4 text-green-600"/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Appointment completed</p>
                <p className="text-xs text-gray-500">Dr. Johnson with Michael Brown - 10 minutes ago</p>
              </div>
              <badge_1.Badge className="bg-green-100 text-green-800">Completed</badge_1.Badge>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
exports.default = EnhancedDashboard;
