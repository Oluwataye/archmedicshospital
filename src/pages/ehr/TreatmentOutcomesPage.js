"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var table_1 = require("@/components/ui/table");
var lucide_react_1 = require("lucide-react");
var select_1 = require("@/components/ui/select");
var sonner_1 = require("sonner");
var TreatmentOutcomesPage = function () {
    var _a = (0, react_1.useState)(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = (0, react_1.useState)('all'), treatmentType = _b[0], setTreatmentType = _b[1];
    var _c = (0, react_1.useState)('all'), timeRange = _c[0], setTimeRange = _c[1];
    // Sample treatment outcomes data
    var treatmentOutcomesData = [
        {
            id: 'TO-2025-001',
            treatment: 'Antibiotic Therapy (Amoxicillin)',
            condition: 'Bacterial Pneumonia',
            patient: 'Edwards, Michael',
            startDate: '2025-03-15',
            endDate: '2025-03-25',
            outcome: 'Successful',
            notes: 'Complete resolution of symptoms after 10-day course',
            department: 'Pulmonology'
        },
        {
            id: 'TO-2025-002',
            treatment: 'ACE Inhibitor (Lisinopril)',
            condition: 'Hypertension',
            patient: 'Johnson, Sarah',
            startDate: '2025-01-10',
            endDate: 'Ongoing',
            outcome: 'Partially Successful',
            notes: 'Blood pressure reduced but not yet at target level',
            department: 'Cardiology'
        },
        {
            id: 'TO-2025-003',
            treatment: 'Cognitive Behavioral Therapy',
            condition: 'Generalized Anxiety Disorder',
            patient: 'Wilson, Emma',
            startDate: '2025-02-05',
            endDate: '2025-04-15',
            outcome: 'Successful',
            notes: 'Significant reduction in anxiety symptoms and improved coping strategies',
            department: 'Psychiatry'
        },
        {
            id: 'TO-2025-004',
            treatment: 'Physical Therapy',
            condition: 'Lumbar Disc Herniation',
            patient: 'Martinez, Carlos',
            startDate: '2025-03-01',
            endDate: '2025-05-01',
            outcome: 'Successful',
            notes: 'Pain resolved, mobility restored to normal levels',
            department: 'Orthopedics'
        },
        {
            id: 'TO-2025-005',
            treatment: 'Metformin',
            condition: 'Type 2 Diabetes',
            patient: 'Thompson, Robert',
            startDate: '2025-01-15',
            endDate: 'Ongoing',
            outcome: 'Partially Successful',
            notes: 'Blood glucose improved but still above target',
            department: 'Endocrinology'
        }
    ];
    // Filter data based on selected filters and search term
    var filteredData = treatmentOutcomesData.filter(function (item) {
        var matchesSearch = item.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.department.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesTreatmentType = treatmentType === 'all' ||
            (treatmentType === 'medication' && (item.treatment.includes('Therapy') || item.treatment.includes('Inhibitor') || item.treatment.includes('Metformin'))) ||
            (treatmentType === 'procedure' && (item.treatment.includes('Physical Therapy') || item.treatment.includes('Surgery'))) ||
            (treatmentType === 'behavioral' && item.treatment.includes('Behavioral'));
        var matchesTimeRange = timeRange === 'all' ||
            (timeRange === 'ongoing' && item.endDate === 'Ongoing') ||
            (timeRange === 'completed' && item.endDate !== 'Ongoing');
        return matchesSearch && matchesTreatmentType && matchesTimeRange;
    });
    // Handle export report
    var handleExportReport = function () {
        sonner_1.toast.success('Treatment outcomes report exported successfully');
        // In a real application, this would generate a PDF or CSV file
    };
    // Handle view details
    var handleViewDetails = function (id) {
        sonner_1.toast.info("Viewing details for treatment outcome ".concat(id));
        // In a real application, this would open a modal or navigate to a details page
    };
    return (<div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Treatment Outcomes</h1>
          <p className="text-gray-500 text-sm">View and analyze treatment outcome data</p>
        </div>
        <button_1.Button onClick={handleExportReport} className="flex items-center gap-2">
          <lucide_react_1.Download size={16}/>
          Export Report
        </button_1.Button>
      </div>

      <card_1.Card>
        <card_1.CardHeader className="pb-3">
          <card_1.CardTitle>Filter Options</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <lucide_react_1.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
                <input_1.Input placeholder="Search by treatment, condition, or patient..." className="pl-8" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
              </div>
            </div>
            <div>
              <select_1.Select value={treatmentType} onValueChange={setTreatmentType}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Treatment Type"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="all">All Treatment Types</select_1.SelectItem>
                  <select_1.SelectItem value="medication">Medication</select_1.SelectItem>
                  <select_1.SelectItem value="procedure">Procedure</select_1.SelectItem>
                  <select_1.SelectItem value="behavioral">Behavioral</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>
            <div>
              <select_1.Select value={timeRange} onValueChange={setTimeRange}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Time Range"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="all">All Time Ranges</select_1.SelectItem>
                  <select_1.SelectItem value="ongoing">Ongoing Treatments</select_1.SelectItem>
                  <select_1.SelectItem value="completed">Completed Treatments</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Treatment Outcomes Table */}
      <card_1.Card>
        <card_1.CardHeader className="pb-3">
          <div className="flex items-center">
            <lucide_react_1.BarChart2 size={18} className="mr-2 text-blue-500"/>
            <card_1.CardTitle>Treatment Outcomes</card_1.CardTitle>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          <table_1.Table>
            <table_1.TableHeader>
              <table_1.TableRow>
                <table_1.TableHead>ID</table_1.TableHead>
                <table_1.TableHead>Treatment</table_1.TableHead>
                <table_1.TableHead>Condition</table_1.TableHead>
                <table_1.TableHead>Patient</table_1.TableHead>
                <table_1.TableHead>Start Date</table_1.TableHead>
                <table_1.TableHead>Status</table_1.TableHead>
                <table_1.TableHead>Outcome</table_1.TableHead>
                <table_1.TableHead>Actions</table_1.TableHead>
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {filteredData.length > 0 ? (filteredData.map(function (item) { return (<table_1.TableRow key={item.id}>
                    <table_1.TableCell className="font-medium">{item.id}</table_1.TableCell>
                    <table_1.TableCell>{item.treatment}</table_1.TableCell>
                    <table_1.TableCell>{item.condition}</table_1.TableCell>
                    <table_1.TableCell>{item.patient}</table_1.TableCell>
                    <table_1.TableCell>{item.startDate}</table_1.TableCell>
                    <table_1.TableCell>
                      <span className={"px-2 py-1 rounded-full text-xs ".concat(item.endDate === 'Ongoing'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800')}>
                        {item.endDate === 'Ongoing' ? 'Ongoing' : 'Completed'}
                      </span>
                    </table_1.TableCell>
                    <table_1.TableCell>
                      <span className={"px-2 py-1 rounded-full text-xs ".concat(item.outcome === 'Successful'
                ? 'bg-green-100 text-green-800'
                : item.outcome === 'Partially Successful'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800')}>
                        {item.outcome}
                      </span>
                    </table_1.TableCell>
                    <table_1.TableCell>
                      <button_1.Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600" onClick={function () { return handleViewDetails(item.id); }}>
                        <lucide_react_1.FileText size={14} className="mr-1"/>
                        Details
                      </button_1.Button>
                    </table_1.TableCell>
                  </table_1.TableRow>); })) : (<table_1.TableRow>
                  <table_1.TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    No treatment outcomes found matching your criteria.
                  </table_1.TableCell>
                </table_1.TableRow>)}
            </table_1.TableBody>
          </table_1.Table>
          
          {filteredData.length > 0 && (<div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div>
                Showing <span className="font-medium">{filteredData.length}</span> of{" "}
                <span className="font-medium">{treatmentOutcomesData.length}</span> treatment outcomes
              </div>
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
exports.default = TreatmentOutcomesPage;
