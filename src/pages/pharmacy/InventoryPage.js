"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InventoryPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var table_1 = require("@/components/ui/table");
var progress_1 = require("@/components/ui/progress");
var use_toast_1 = require("@/hooks/use-toast");
function InventoryPage() {
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var inventoryItems = (0, react_1.useState)([
        {
            id: 'MED001',
            name: 'Amoxicillin',
            type: 'Antibiotic',
            form: 'Tablet',
            strength: '500mg',
            quantity: 120,
            threshold: 50,
            supplier: 'PharmSource Inc.',
            expiryDate: '2026-12-31',
            location: 'Cabinet A-3'
        },
        {
            id: 'MED002',
            name: 'Lisinopril',
            type: 'Antihypertensive',
            form: 'Tablet',
            strength: '10mg',
            quantity: 75,
            threshold: 30,
            supplier: 'MediPharm Ltd.',
            expiryDate: '2025-09-15',
            location: 'Cabinet B-2'
        },
        {
            id: 'MED003',
            name: 'Insulin Lispro',
            type: 'Antidiabetic',
            form: 'Solution',
            strength: '100U/mL',
            quantity: 15,
            threshold: 20,
            supplier: 'DiaCare Solutions',
            expiryDate: '2025-04-30',
            location: 'Refrigerator R-1'
        },
        {
            id: 'MED004',
            name: 'Atorvastatin',
            type: 'Statin',
            form: 'Tablet',
            strength: '20mg',
            quantity: 200,
            threshold: 80,
            supplier: 'PharmSource Inc.',
            expiryDate: '2026-08-25',
            location: 'Cabinet A-5'
        },
        {
            id: 'MED005',
            name: 'Morphine Sulfate',
            type: 'Analgesic',
            form: 'Solution',
            strength: '10mg/mL',
            quantity: 12,
            threshold: 15,
            supplier: 'PainCare Solutions',
            expiryDate: '2025-05-20',
            location: 'Controlled Substances Safe'
        }
    ])[0];
    var handleSearch = function (e) {
        e.preventDefault();
        toast({
            title: "Searching inventory",
            description: "Query: ".concat(searchQuery),
        });
    };
    var requestRestock = function (id, name) {
        toast({
            title: "Restock Requested",
            description: "A restock request has been sent for ".concat(name, " (").concat(id, ")"),
            variant: "default",
        });
    };
    var getBgColorForQuantity = function (quantity, threshold) {
        if (quantity <= threshold * 0.5) {
            return "bg-red-50";
        }
        else if (quantity <= threshold) {
            return "bg-yellow-50";
        }
        return "";
    };
    var getStatusForQuantity = function (quantity, threshold) {
        if (quantity <= threshold * 0.5) {
            return { status: "Critical Low", color: "text-red-500", icon: <lucide_react_1.AlertTriangle size={16} className="mr-1"/> };
        }
        else if (quantity <= threshold) {
            return { status: "Low", color: "text-yellow-500", icon: <lucide_react_1.AlertTriangle size={16} className="mr-1"/> };
        }
        return { status: "Normal", color: "text-green-500", icon: null };
    };
    var getProgressColor = function (quantity, threshold) {
        if (quantity <= threshold * 0.5) {
            return "bg-red-500";
        }
        else if (quantity <= threshold) {
            return "bg-yellow-500";
        }
        return "bg-green-500";
    };
    var calculateProgressPercentage = function (quantity) {
        // Assume 250 is the max capacity for visualization purposes
        var maxCapacity = 250;
        return Math.min(100, (quantity / maxCapacity) * 100);
    };
    var filteredItems = inventoryItems.filter(function (item) {
        if (searchQuery) {
            var query = searchQuery.toLowerCase();
            return (item.name.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query));
        }
        return true;
    });
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Drug Inventory</h1>
        <p className="text-gray-600">Manage and track pharmaceutical inventory</p>
      </div>
      
      <card_1.Card className="mb-6">
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle>Inventory Management</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <lucide_react_1.Search size={18} className="text-gray-500"/>
                  </div>
                  <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white" placeholder="Search medications..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
                </div>
              </form>
            </div>
            
            <div className="flex space-x-2">
              <button_1.Button variant="outline" className="flex items-center">
                <lucide_react_1.Filter className="mr-2 h-4 w-4"/> Filter
              </button_1.Button>
              <button_1.Button className="flex items-center">
                <lucide_react_1.Plus className="mr-2 h-4 w-4"/> Add Medication
              </button_1.Button>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
      
      <card_1.Card>
        <card_1.CardContent className="p-0">
          <div className="overflow-x-auto">
            <table_1.Table>
              <table_1.TableHeader>
                <table_1.TableRow>
                  <table_1.TableHead>Medication ID</table_1.TableHead>
                  <table_1.TableHead>Name</table_1.TableHead>
                  <table_1.TableHead>Category</table_1.TableHead>
                  <table_1.TableHead>Form/Strength</table_1.TableHead>
                  <table_1.TableHead>Quantity</table_1.TableHead>
                  <table_1.TableHead>Status</table_1.TableHead>
                  <table_1.TableHead>Location</table_1.TableHead>
                  <table_1.TableHead>Expiry</table_1.TableHead>
                  <table_1.TableHead>Actions</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {filteredItems.length === 0 ? (<table_1.TableRow>
                    <table_1.TableCell colSpan={9} className="text-center py-4">
                      No medications found matching your criteria
                    </table_1.TableCell>
                  </table_1.TableRow>) : (filteredItems.map(function (item) {
            var _a = getStatusForQuantity(item.quantity, item.threshold), status = _a.status, color = _a.color, icon = _a.icon;
            return (<table_1.TableRow key={item.id} className={getBgColorForQuantity(item.quantity, item.threshold)}>
                        <table_1.TableCell className="font-medium">{item.id}</table_1.TableCell>
                        <table_1.TableCell>{item.name}</table_1.TableCell>
                        <table_1.TableCell>{item.type}</table_1.TableCell>
                        <table_1.TableCell>{item.form}, {item.strength}</table_1.TableCell>
                        <table_1.TableCell>
                          <div className="flex flex-col space-y-1">
                            <div className="text-sm">{item.quantity} units</div>
                            <progress_1.Progress value={calculateProgressPercentage(item.quantity)} className={"h-2 ".concat(getProgressColor(item.quantity, item.threshold))}/>
                          </div>
                        </table_1.TableCell>
                        <table_1.TableCell>
                          <div className={"flex items-center ".concat(color)}>
                            {icon}
                            <span>{status}</span>
                          </div>
                        </table_1.TableCell>
                        <table_1.TableCell>{item.location}</table_1.TableCell>
                        <table_1.TableCell>{new Date(item.expiryDate).toLocaleDateString()}</table_1.TableCell>
                        <table_1.TableCell>
                          {item.quantity <= item.threshold && (<button_1.Button size="sm" variant="outline" className="text-primary" onClick={function () { return requestRestock(item.id, item.name); }}>
                              Restock
                            </button_1.Button>)}
                          {item.quantity > item.threshold && (<button_1.Button size="sm" variant="outline" className="text-gray-500">
                              View
                            </button_1.Button>)}
                        </table_1.TableCell>
                      </table_1.TableRow>);
        }))}
              </table_1.TableBody>
            </table_1.Table>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
