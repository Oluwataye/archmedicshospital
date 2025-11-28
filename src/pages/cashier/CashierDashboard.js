"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var sonner_1 = require("sonner");
var CashierDashboard = function () {
    var _a = (0, react_1.useState)('New Payment'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)({
        id: '',
        name: ''
    }), patientInfo = _b[0], setPatientInfo = _b[1];
    var _c = (0, react_1.useState)(''), patientSearchQuery = _c[0], setPatientSearchQuery = _c[1];
    var _d = (0, react_1.useState)([
        { id: 1, name: 'Echocardiogram', price: 120.00 },
        { id: 2, name: 'Consultation Fee', price: 75.00 }
    ]), services = _d[0], setServices = _d[1];
    var _e = (0, react_1.useState)(services), selectedServices = _e[0], setSelectedServices = _e[1];
    var _f = (0, react_1.useState)({ applied: true, amount: 45.50 }), discount = _f[0], setDiscount = _f[1];
    var _g = (0, react_1.useState)('Cash'), selectedPaymentMethod = _g[0], setSelectedPaymentMethod = _g[1];
    // Date formatting for current date and time
    var currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    var currentTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    var handleTabChange = function (tab) {
        setActiveTab(tab);
    };
    var handlePatientSearch = function () {
        // In a real application, this would search a patient database
        if (patientSearchQuery) {
            setPatientInfo({
                id: "P-".concat(Math.floor(Math.random() * 90000) + 10000),
                name: patientSearchQuery
            });
            setPatientSearchQuery('');
            sonner_1.toast.success("Patient ".concat(patientSearchQuery, " found!"));
        }
        else {
            sonner_1.toast.error("Please enter a patient name or ID");
        }
    };
    var getTotalAmount = function () {
        var subtotal = selectedServices.reduce(function (total, service) { return total + service.price; }, 0);
        return discount.applied ? subtotal - discount.amount : subtotal;
    };
    var handleRemoveService = function (serviceId) {
        setSelectedServices(selectedServices.filter(function (service) { return service.id !== serviceId; }));
        sonner_1.toast.info("Service removed from invoice");
    };
    var handleProcessPayment = function () {
        if (!patientInfo.id) {
            sonner_1.toast.error("Please select a patient before processing payment");
            return;
        }
        sonner_1.toast.success("Payment of $".concat(getTotalAmount().toFixed(2), " processed via ").concat(selectedPaymentMethod));
        // In a real app, we'd process the payment and clear the form
        setPatientInfo({ id: '', name: '' });
        setSelectedServices([]);
        setDiscount({ applied: false, amount: 0 });
    };
    var handleAddService = function () {
        // This would typically open a modal with available services
        // For now, we'll just add a demo service
        var newService = {
            id: Date.now(),
            name: 'Additional Service',
            price: 50.00
        };
        setSelectedServices(__spreadArray(__spreadArray([], selectedServices, true), [newService], false));
        sonner_1.toast.success("Service added to invoice");
    };
    return (<div className="flex-1 p-6 overflow-auto">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Cashier &gt; Dashboard</div>
      
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Cashier Dashboard</h1>
      
      {/* Main Panel */}
      <card_1.Card className="mb-6">
        {/* Quick Actions Tabs */}
        <div className="flex border-b border-gray-200">
          <button className={"px-4 py-3 font-semibold ".concat(activeTab === 'New Payment' ? 'bg-blue-500 text-white' : 'text-gray-500')} onClick={function () { return handleTabChange('New Payment'); }}>
            New Payment
          </button>
          <button className={"px-4 py-3 font-semibold ".concat(activeTab === 'Pending' ? 'bg-blue-500 text-white' : 'text-gray-500')} onClick={function () { return handleTabChange('Pending'); }}>
            Pending
          </button>
          <button className={"px-4 py-3 font-semibold ".concat(activeTab === "Today's Summary" ? 'bg-blue-500 text-white' : 'text-gray-500')} onClick={function () { return handleTabChange("Today's Summary"); }}>
            Today's Summary
          </button>
          <button className={"px-4 py-3 font-semibold ".concat(activeTab === 'Daily Close' ? 'bg-blue-500 text-white' : 'text-gray-500')} onClick={function () { return handleTabChange('Daily Close'); }}>
            Daily Close
          </button>
          <button className={"px-4 py-3 font-semibold ".concat(activeTab === 'Help' ? 'bg-blue-500 text-white' : 'text-gray-500')} onClick={function () { return handleTabChange('Help'); }}>
            Help
          </button>
        </div>
        
        <card_1.CardContent className="p-4">
          <div className="flex justify-end mb-4">
            {/* Date and Clock */}
            <div className="w-56 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
              <span className="font-bold text-gray-800 text-sm">{currentDate} - {currentTime}</span>
            </div>
          </div>
          
          {activeTab === 'New Payment' && (<div className="flex space-x-4">
              <div className="w-2/3">
                {/* Patient Information Form */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Patient Information</h2>
                  
                  <div className="mb-4">
                    <label className="block text-gray-500 text-sm mb-1">Patient ID/Name:</label>
                    <div className="flex">
                      <input_1.Input value={patientInfo.id && patientInfo.name ? "".concat(patientInfo.id, " - ").concat(patientInfo.name) : ""} placeholder="Search or select a patient" className="flex-1 mr-2" readOnly={!!patientInfo.id} onChange={function (e) { return setPatientSearchQuery(e.target.value); }}/>
                      <button_1.Button className="bg-blue-500" onClick={handlePatientSearch}>
                        <lucide_react_1.Search className="h-4 w-4 mr-2"/>
                        Search
                      </button_1.Button>
                    </div>
                    {!patientInfo.id && (<div className="mt-2 flex">
                        <input_1.Input placeholder="Enter patient name to search" className="flex-1 mr-2" value={patientSearchQuery} onChange={function (e) { return setPatientSearchQuery(e.target.value); }}/>
                      </div>)}
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-gray-500 text-sm mb-1">Department/Service:</label>
                      <div className="relative">
                        <select className="w-full border border-gray-300 rounded p-2 text-gray-800 appearance-none">
                          <option>Cardiology</option>
                          <option>Neurology</option>
                          <option>Orthopedics</option>
                          <option>Pediatrics</option>
                          <option>General Medicine</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <span className="text-gray-500">▼</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-500 text-sm mb-1">Service Date:</label>
                      <div className="relative">
                        <select className="w-full border border-gray-300 rounded p-2 text-gray-800 appearance-none">
                          <option>{currentDate}</option>
                          <option>Yesterday</option>
                          <option>Custom Date</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <span className="text-gray-500">▼</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Details Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Details</h2>
                  
                  {/* Services Table */}
                  <div className="mb-4">
                    <div className="bg-gray-100 p-2 grid grid-cols-12 font-bold text-sm text-gray-800">
                      <div className="col-span-7">Service</div>
                      <div className="col-span-3">Amount</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    
                    {selectedServices.length > 0 ? (selectedServices.map(function (service) { return (<div key={service.id} className="border border-gray-200 p-2 grid grid-cols-12 text-sm">
                          <div className="col-span-7">{service.name}</div>
                          <div className="col-span-3">${service.price.toFixed(2)}</div>
                          <div className="col-span-2">
                            <button className="text-red-500" onClick={function () { return handleRemoveService(service.id); }}>
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                <path d="M8 8L16 16M8 16L16 8" strokeWidth="2"/>
                              </svg>
                            </button>
                          </div>
                        </div>); })) : (<div className="border border-gray-200 p-4 text-center text-gray-500">
                        No services added yet
                      </div>)}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-4 mb-4">
                    <button_1.Button variant="outline" className="text-blue-500 border-blue-500" onClick={handleAddService}>
                      + Add Service
                    </button_1.Button>
                    <button_1.Button variant="outline" className={"".concat(discount.applied ? 'bg-blue-100 text-blue-700' : 'text-blue-500 border-blue-500')} onClick={function () { return setDiscount({ applied: !discount.applied, amount: 45.50 }); }}>
                      {discount.applied ? 'Remove Discount' : 'Apply Discount'}
                    </button_1.Button>
                  </div>
                  
                  {/* Total Section */}
                  <div className="bg-blue-50 border border-blue-200 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-800">Total Amount</div>
                        {discount.applied && (<div className="text-xs text-gray-500">(${discount.amount.toFixed(2)} discount applied)</div>)}
                      </div>
                      <div className="text-xl font-bold text-gray-800">${getTotalAmount().toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Options */}
              <div className="w-1/3">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 h-full">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Options</h2>
                  
                  <div className="flex flex-col space-y-3">
                    <button_1.Button className={"py-2 rounded-full font-bold ".concat(selectedPaymentMethod === 'Cash' ? 'bg-blue-500 text-white' : 'bg-white border border-blue-500 text-blue-500')} onClick={function () { return setSelectedPaymentMethod('Cash'); }}>
                      Cash
                    </button_1.Button>
                    <button_1.Button variant={selectedPaymentMethod === 'Credit Card' ? 'default' : 'outline'} className={"py-2 rounded-full font-bold ".concat(selectedPaymentMethod === 'Credit Card' ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-500')} onClick={function () { return setSelectedPaymentMethod('Credit Card'); }}>
                      Credit Card
                    </button_1.Button>
                    <button_1.Button variant={selectedPaymentMethod === 'Insurance' ? 'default' : 'outline'} className={"py-2 rounded-full font-bold ".concat(selectedPaymentMethod === 'Insurance' ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-500')} onClick={function () { return setSelectedPaymentMethod('Insurance'); }}>
                      Insurance
                    </button_1.Button>
                    <button_1.Button variant={selectedPaymentMethod === 'Bank Transfer' ? 'default' : 'outline'} className={"py-2 rounded-full font-bold ".concat(selectedPaymentMethod === 'Bank Transfer' ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-500')} onClick={function () { return setSelectedPaymentMethod('Bank Transfer'); }}>
                      Bank Transfer
                    </button_1.Button>
                  </div>
                  
                  <div className="mt-6">
                    <button_1.Button className="bg-green-600 text-white py-2 rounded w-full font-bold hover:bg-green-700" onClick={handleProcessPayment} disabled={!patientInfo.id || selectedServices.length === 0}>
                      Process Payment
                    </button_1.Button>
                  </div>
                </div>
              </div>
            </div>)}
          
          {activeTab !== 'New Payment' && (<div className="flex items-center justify-center p-8 text-gray-500">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{activeTab}</h3>
                <p>This feature will be available soon.</p>
              </div>
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
exports.default = CashierDashboard;
