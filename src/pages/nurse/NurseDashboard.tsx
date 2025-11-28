
import { useState } from 'react';
import { AlertTriangle, Bell, Search, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function NurseDashboard() {
  const { logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    patients: true,
    medication: false,
    vitalSigns: false,
    tasks: false,
    wards: false,
    emergency: false,
    communication: false
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="w-56 bg-gray-800 text-white flex flex-col">
        {/* App Logo Area */}
        <div className="h-16 bg-gray-900 flex items-center px-4">
          <div className="w-10 h-10 bg-medical-primary rounded-full flex items-center justify-center text-white text-xl font-bold mr-3">A</div>
          <h1 className="font-bold text-xl">ARCHMEDICS</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto">
          {/* Dashboard (Active) */}
          <div className="bg-medical-primary border-l-4 border-blue-700 py-3 px-4 flex items-center">
            <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full mr-3">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="font-semibold">Dashboard</span>
          </div>

          {/* Patients (Expandable) */}
          <div 
            className="bg-gray-700 py-3 px-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleMenu('patients')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full mr-3">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <span>Patients</span>
            </div>
            {expandedMenus.patients ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {/* Patients Submenu */}
          {expandedMenus.patients && (
            <>
              <div className="bg-gray-800 py-2 px-4 pl-10 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
                View Admitted Patients
              </div>
              <div className="bg-gray-800 py-2 px-4 pl-10 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
                Search Patients
              </div>
              <div className="bg-gray-800 py-2 px-4 pl-10 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
                Patient Details
              </div>
            </>
          )}

          {/* Medication Admin (Expandable) */}
          <div 
            className="bg-gray-700 py-3 px-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleMenu('medication')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full mr-3">
                <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span>Medication Admin</span>
            </div>
            {expandedMenus.medication ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {/* Show medication submenu if expanded */}
          {expandedMenus.medication && (
            <>
              <div className="bg-gray-800 py-2 px-4 pl-10 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
                Administer Medication
              </div>
              <div className="bg-gray-800 py-2 px-4 pl-10 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
                Medication Schedule
              </div>
              <div className="bg-gray-800 py-2 px-4 pl-10 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
                Medication History
              </div>
            </>
          )}

          {/* Vital Signs Monitoring (Expandable) */}
          <div 
            className="bg-gray-700 py-3 px-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleMenu('vitalSigns')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full mr-3">
                <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path d="M4,12 L8,8 L12,12 L16,8 L20,12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <span>Vital Signs</span>
            </div>
            {expandedMenus.vitalSigns ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {/* Show vitals submenu if expanded */}
          {expandedMenus.vitalSigns && (
            <>
              <div className="bg-gray-800 py-2 px-4 pl-10 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
                Record Vitals
              </div>
              <div className="bg-gray-800 py-2 px-4 pl-10 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
                View Vital Trends
              </div>
            </>
          )}

          {/* Tasks & Schedules (Expandable) */}
          <div 
            className="bg-gray-700 py-3 px-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleMenu('tasks')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full mr-3">
                <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4,6 H20 M4,12 H20 M4,18 H20" />
                </svg>
              </div>
              <span>Tasks & Schedules</span>
            </div>
            {expandedMenus.tasks ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {/* Wards & Rooms (Expandable) */}
          <div 
            className="bg-gray-700 py-3 px-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleMenu('wards')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full mr-3">
                <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3,3 H10 V10 H3 V3 M14,3 H21 V10 H14 V3 M3,14 H10 V21 H3 V14 M14,14 H21 V21 H14 V14" />
                </svg>
              </div>
              <span>Wards & Rooms</span>
            </div>
            {expandedMenus.wards ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {/* Emergency Alerts (Expandable) */}
          <div 
            className="bg-gray-700 py-3 px-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleMenu('emergency')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full mr-3">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span>Emergency Alerts</span>
            </div>
            {expandedMenus.emergency ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {/* Communication (Expandable) */}
          <div 
            className="bg-gray-700 py-3 px-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleMenu('communication')}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full mr-3">
                <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path d="M4,4 L20,12 L4,20 L4,4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <span>Communication</span>
            </div>
            {expandedMenus.communication ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {/* Compact items */}
          <div className="bg-gray-700 py-2 px-4 flex items-center cursor-pointer hover:bg-gray-600">
            <div className="w-6 h-6 flex items-center justify-center border border-white rounded-full mr-3">
              <svg className="w-3 h-3" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4,6 H20 M4,12 H20 M4,18 H20" />
              </svg>
            </div>
            <span className="text-sm">Reports</span>
          </div>

          <div className="bg-gray-700 py-2 px-4 flex items-center cursor-pointer hover:bg-gray-600">
            <div className="w-6 h-6 flex items-center justify-center border border-white rounded-full mr-3">
              <svg className="w-3 h-3" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12,5 V19 M5,12 H19" />
              </svg>
            </div>
            <span className="text-sm">Inventory Requests</span>
          </div>

          <div className="bg-gray-700 py-2 px-4 flex items-center cursor-pointer hover:bg-gray-600">
            <div className="w-6 h-6 flex items-center justify-center border border-white rounded-full mr-3">
              <svg className="w-3 h-3" fill="none" stroke="white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" fill="white" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12,5 V7 M12,17 V19" />
              </svg>
            </div>
            <span className="text-sm">Training & Guidelines</span>
          </div>
        </nav>

        {/* Profile Section */}
        <div className="bg-gray-700 py-2 px-4 flex items-center cursor-pointer hover:bg-gray-600">
          <div className="w-6 h-6 flex items-center justify-center bg-medical-primary rounded-full mr-3">
            <span className="text-sm font-bold">N</span>
          </div>
          <span className="text-sm">Profile / My Account</span>
        </div>

        {/* Logout Button */}
        <div className="bg-red-500 py-2 px-4 flex items-center cursor-pointer hover:bg-red-600" onClick={logout}>
          <LogOut className="w-4 h-4 mr-3" />
          <span>Logout</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search patients, tasks or alerts..."
              className="bg-gray-100 pl-10 pr-4 py-2 rounded border border-gray-300 w-64"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative cursor-pointer">
              <Bell className="h-6 w-6 text-gray-500" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Nurse Johnson</span>
              <div className="w-8 h-8 bg-medical-primary rounded-full flex items-center justify-center text-white font-bold">
                N
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 mb-4">
            Home &gt; Dashboard
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Nurse Dashboard</h1>
            <p className="text-gray-500">Friday, May 2, 2025 • Day Shift (7:00 AM - 7:00 PM)</p>
          </div>

          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Shift Summary */}
            <div className="bg-white rounded shadow border border-gray-200">
              <div className="px-4 py-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Shift Summary</h2>
              </div>
              <div className="p-4 flex">
                {/* Pie chart simulation */}
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                    <path 
                      d="M50,50 L50,5 A45,45 0 0,1 95,50 Z" 
                      fill="#3498db" 
                    />
                    <path 
                      d="M50,50 L95,50 A45,45 0 0,1 50,95 Z" 
                      fill="#e74c3c" 
                    />
                    <path 
                      d="M50,50 L50,95 A45,45 0 0,1 5,50 Z" 
                      fill="#2ecc71" 
                    />
                    <path 
                      d="M50,50 L5,50 A45,45 0 0,1 50,5 Z" 
                      fill="#e0e0e0" 
                    />
                  </svg>
                </div>
                
                {/* Legend */}
                <div className="ml-6">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-800">Stable (12)</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-red-500 mr-2"></div>
                    <span className="text-sm text-gray-800">Critical (5)</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-800">Recovering (8)</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">Total Patients Assigned: 25</p>
                </div>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-white rounded shadow border border-gray-200">
              <div className="px-4 py-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Critical Alerts</h2>
              </div>
              <div className="p-4">
                <div className="bg-red-50 p-2 rounded mb-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-red-500 font-medium">Code Blue Alert - Room 312</span>
                  </div>
                  <span className="text-red-500 text-xs">2m ago</span>
                </div>
                
                <div className="bg-yellow-50 p-2 rounded mb-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-yellow-600 font-medium">Critically Low BP - Patient ID: P-10542</span>
                  </div>
                  <span className="text-yellow-600 text-xs">15m ago</span>
                </div>
                
                <div className="bg-green-50 p-2 rounded flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-green-600 font-medium">Med Verification - Patient ID: P-10476</span>
                  </div>
                  <span className="text-green-600 text-xs">21m ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Today's Tasks */}
            <div className="bg-white rounded shadow border border-gray-200">
              <div className="px-4 py-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Today's Tasks</h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-800">Medication Administration</span>
                    <span className="text-sm text-gray-800">70%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-800">Vital Signs Recording</span>
                    <span className="text-sm text-gray-800">80%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-800">Patient Assessments</span>
                    <span className="text-sm text-gray-800">50%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-800">Documentation</span>
                    <span className="text-sm text-gray-800">30%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Medications */}
            <div className="bg-white rounded shadow border border-gray-200">
              <div className="px-4 py-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Upcoming Medications</h2>
              </div>
              <div className="p-4">
                <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-3">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-semibold text-gray-800">Amoxicillin 500mg</h3>
                    <button className="bg-medical-primary text-white text-xs px-3 py-1 rounded-full">
                      Give
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Patient: Alice Johnson (P-10542) • Room 204</p>
                  <p className="text-xs text-gray-500">Due in: 15 minutes</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-semibold text-gray-800">Insulin Regular 10 units</h3>
                    <button className="bg-medical-primary text-white text-xs px-3 py-1 rounded-full">
                      Give
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Patient: Robert Brown (P-10398) • Room 210</p>
                  <p className="text-xs text-gray-500">Due in: 30 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row */}
          <div className="bg-white rounded shadow border border-gray-200">
            <div className="px-4 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">Admitted Patients Overview</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Patient Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Room</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Diagnosis</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Next Assessment</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          AJ
                        </div>
                        <div>
                          <p className="text-sm text-gray-800">Alice Johnson</p>
                          <p className="text-xs text-gray-500">ID: P-10542</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">204</td>
                    <td className="py-3 px-4 text-sm text-gray-800">Stroke</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
                        Critical
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">10:30 AM</td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1 text-xs text-white bg-medical-primary rounded">
                        View
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          RB
                        </div>
                        <div>
                          <p className="text-sm text-gray-800">Robert Brown</p>
                          <p className="text-xs text-gray-500">ID: P-10398</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">210</td>
                    <td className="py-3 px-4 text-sm text-gray-800">Diabetes</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                        Stable
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">11:15 AM</td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1 text-xs text-white bg-medical-primary rounded">
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
