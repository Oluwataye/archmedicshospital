"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var react_router_dom_1 = require("react-router-dom");
var tabs_1 = require("@/components/ui/tabs");
var ResultsPage = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    // Select the "Pending" tab by default
    return (<div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Results</div>
      
      {/* Page Header with Date */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Test Results Management</h1>
      </div>
      
      {/* Results Tabs */}
      <card_1.Card className="border border-gray-200 mb-6">
        <tabs_1.Tabs defaultValue="pending" className="w-full">
          <tabs_1.TabsList className="grid grid-cols-3 w-full max-w-md">
            <tabs_1.TabsTrigger value="pending" onClick={function () { return navigate('/lab/results/pending'); }}>
              Pending Results
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="completed" onClick={function () { return navigate('/lab/results/completed'); }}>
              Completed Results
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="critical" onClick={function () { return navigate('/lab/results/critical'); }}>
              Critical Results
            </tabs_1.TabsTrigger>
          </tabs_1.TabsList>
          <tabs_1.TabsContent value="pending">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">Pending Results</h3>
              <p className="text-gray-500 mt-2">Redirecting to pending results...</p>
              <button_1.Button className="mt-4" style={{ backgroundColor: '#3B82F6' }} onClick={function () { return navigate('/lab/results/pending'); }}>
                View Pending Results
              </button_1.Button>
            </div>
          </tabs_1.TabsContent>
          <tabs_1.TabsContent value="completed">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">Completed Results</h3>
              <p className="text-gray-500 mt-2">Redirecting to completed results...</p>
              <button_1.Button className="mt-4" style={{ backgroundColor: '#3B82F6' }} onClick={function () { return navigate('/lab/results/completed'); }}>
                View Completed Results
              </button_1.Button>
            </div>
          </tabs_1.TabsContent>
          <tabs_1.TabsContent value="critical">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium">Critical Results</h3>
              <p className="text-gray-500 mt-2">Redirecting to critical results...</p>
              <button_1.Button className="mt-4" style={{ backgroundColor: '#3B82F6' }} onClick={function () { return navigate('/lab/results/critical'); }}>
                View Critical Results
              </button_1.Button>
            </div>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </card_1.Card>
      
      {/* Informational Card */}
      <card_1.Card className="border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Results Management</h2>
        <p className="text-gray-600 mb-4">
          Manage test results through the tabs above. View pending results that need to be processed, 
          review completed results, or address critical results that require immediate attention.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Pending Results</h3>
            <p className="text-sm text-yellow-700">
              Tests that have been processed but results are not yet verified.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-medium text-green-800 mb-2">Completed Results</h3>
            <p className="text-sm text-green-700">
              Tests with verified results ready for physician review.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h3 className="font-medium text-red-800 mb-2">Critical Results</h3>
            <p className="text-sm text-red-700">
              Results requiring immediate clinical attention or intervention.
            </p>
          </div>
        </div>
      </card_1.Card>
    </div>);
};
exports.default = ResultsPage;
