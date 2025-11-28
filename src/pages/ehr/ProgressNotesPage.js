"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var input_1 = require("@/components/ui/input");
var use_mobile_1 = require("@/hooks/use-mobile");
var card_1 = require("@/components/ui/card");
var ProgressNotesPage = function () {
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var isMobile = (0, use_mobile_1.useIsMobile)();
    // Sample progress notes data
    var progressNotes = [
        { id: 1, patientName: 'John Smith', date: '2025-04-30', provider: 'Dr. Sarah Wilson', content: 'Patient reports improvement in symptoms. Continue current treatment plan.' },
        { id: 2, patientName: 'Maria Garcia', date: '2025-04-29', provider: 'Dr. James Lee', content: 'Follow-up appointment scheduled in two weeks. Patient showing good response to medication.' },
        { id: 3, patientName: 'David Johnson', date: '2025-04-28', provider: 'Dr. Emily Chen', content: 'Discussed dietary recommendations. Patient will return in one month for reassessment.' },
        { id: 4, patientName: 'Sarah Williams', date: '2025-04-27', provider: 'Dr. Michael Brown', content: 'Reviewed lab results with patient. All values within normal range.' },
    ];
    var filteredNotes = progressNotes.filter(function (note) {
        return note.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return (<div className="container mx-auto py-4 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Progress Notes</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 md:w-80">
            <lucide_react_1.Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
            <input_1.Input placeholder="Search notes..." className="pl-8 w-full" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
          </div>
          <button_1.Button className="whitespace-nowrap">
            <lucide_react_1.PlusCircle className="h-4 w-4 mr-2"/>
            New Note
          </button_1.Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredNotes.length > 0 ? (filteredNotes.map(function (note) { return (<card_1.Card key={note.id} className="overflow-hidden">
              <card_1.CardHeader className="bg-gray-50 pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <card_1.CardTitle className="text-lg">{note.patientName}</card_1.CardTitle>
                    <card_1.CardDescription>{note.provider}</card_1.CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(note.date).toLocaleDateString()}
                  </div>
                </div>
              </card_1.CardHeader>
              <card_1.CardContent className="pt-4">
                <p className="text-sm line-clamp-3">{note.content}</p>
                <div className="mt-4 flex justify-end">
                  <button_1.Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center">
                    <lucide_react_1.FileText className="h-4 w-4 mr-2"/>
                    View Details
                  </button_1.Button>
                </div>
              </card_1.CardContent>
            </card_1.Card>); })) : (<div className="col-span-full flex justify-center py-8">
            <p className="text-lg text-muted-foreground">No progress notes found</p>
          </div>)}
      </div>
    </div>);
};
exports.default = ProgressNotesPage;
