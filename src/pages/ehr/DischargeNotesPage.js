"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var input_1 = require("@/components/ui/input");
var use_mobile_1 = require("@/hooks/use-mobile");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var DischargeNotesPage = function () {
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var isMobile = (0, use_mobile_1.useIsMobile)();
    // Sample discharge notes data
    var dischargeNotes = [
        {
            id: 1,
            patientName: 'Robert Chen',
            date: '2025-04-28',
            doctor: 'Dr. Jennifer Lopez',
            status: 'Completed',
            summary: 'Patient discharged in stable condition. Follow-up appointment scheduled in two weeks. Prescribed medication for pain management.'
        },
        {
            id: 2,
            patientName: 'Lisa Johnson',
            date: '2025-04-27',
            doctor: 'Dr. Michael Roberts',
            status: 'Pending',
            summary: 'Pending final review by attending physician. Patient ready for discharge tomorrow morning.'
        },
        {
            id: 3,
            patientName: 'Thomas Wright',
            date: '2025-04-25',
            doctor: 'Dr. Sarah Wilson',
            status: 'Completed',
            summary: 'Patient discharged with home care instructions. Needs follow-up with specialist in one week.'
        },
        {
            id: 4,
            patientName: 'Emma Garcia',
            date: '2025-04-22',
            doctor: 'Dr. James Peterson',
            status: 'Completed',
            summary: 'Successful recovery from procedure. Discharged with prescription medication and rehabilitation plan.'
        },
    ];
    var filteredNotes = dischargeNotes.filter(function (note) {
        return note.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.summary.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return (<div className="container mx-auto py-4 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Discharge Notes</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 md:w-80">
            <lucide_react_1.Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
            <input_1.Input placeholder="Search discharge notes..." className="pl-8 w-full" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
          </div>
          <button_1.Button className="whitespace-nowrap">
            <lucide_react_1.PlusCircle className="h-4 w-4 mr-2"/>
            New Discharge Note
          </button_1.Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredNotes.length > 0 ? (filteredNotes.map(function (note) { return (<card_1.Card key={note.id}>
              <card_1.CardHeader className="bg-gray-50 pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <card_1.CardTitle className="text-lg">{note.patientName}</card_1.CardTitle>
                    <card_1.CardDescription>{note.doctor}</card_1.CardDescription>
                  </div>
                  <badge_1.Badge variant={note.status === "Completed" ? "default" : "secondary"} className={note.status === "Completed" ? "bg-green-100 text-green-800" : ""}>
                    {note.status}
                  </badge_1.Badge>
                </div>
              </card_1.CardHeader>
              <card_1.CardContent className="pt-4">
                <p className="text-sm mb-2 text-muted-foreground">
                  Discharge Date: {new Date(note.date).toLocaleDateString()}
                </p>
                <p className="text-sm line-clamp-2">{note.summary}</p>
              </card_1.CardContent>
              <card_1.CardFooter className="flex justify-between pt-2 flex-wrap gap-2">
                <button_1.Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center">
                  <lucide_react_1.FileText className="h-4 w-4 mr-2"/>
                  View Details
                </button_1.Button>
                <button_1.Button variant="ghost" size={isMobile ? "sm" : "default"} className="flex items-center">
                  <lucide_react_1.Download className="h-4 w-4 mr-2"/>
                  Download PDF
                </button_1.Button>
              </card_1.CardFooter>
            </card_1.Card>); })) : (<div className="col-span-full flex justify-center py-8">
            <p className="text-lg text-muted-foreground">No discharge notes found</p>
          </div>)}
      </div>
    </div>);
};
exports.default = DischargeNotesPage;
