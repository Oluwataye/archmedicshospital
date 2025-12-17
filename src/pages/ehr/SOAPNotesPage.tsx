import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Plus, FileText, Loader2, Calendar, User, ClipboardList } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { usePatientManagement } from '@/hooks/usePatientManagement';
import { useAuth } from '@/contexts/AuthContext';
import PatientSearchSelect from '@/components/common/PatientSearchSelect';

const SOAPNotesPage = () => {
  const { user } = useAuth();
  const { patients, loading: patientsLoading } = usePatientManagement();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const { records, loading, createRecord, updateRecord, deleteRecord, getRecordsByType } = useMedicalRecords(selectedPatientId);

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    status: 'draft',
  });

  const soapNotes = getRecordsByType('soap');

  const filteredNotes = soapNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewNote = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      status: 'draft',
    });
    setIsNewNoteOpen(true);
  };

  const handleEditNote = (note: any) => {
    setEditingNote(note);
    try {
      const content = JSON.parse(note.content);
      setFormData({
        title: note.title,
        subjective: content.subjective || '',
        objective: content.objective || '',
        assessment: content.assessment || '',
        plan: content.plan || '',
        status: note.status,
      });
    } catch {
      setFormData({
        title: note.title,
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        status: note.status,
      });
    }
    setIsNewNoteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatientId) {
      return;
    }

    try {
      const soapContent = {
        subjective: formData.subjective,
        objective: formData.objective,
        assessment: formData.assessment,
        plan: formData.plan,
      };

      const noteData = {
        patient_id: selectedPatientId,
        provider_id: user?.id || '',
        record_type: 'soap',
        record_date: new Date().toISOString().split('T')[0],
        title: formData.title,
        content: JSON.stringify(soapContent),
        status: formData.status,
      };

      if (editingNote) {
        await updateRecord(editingNote.id, noteData);
      } else {
        await createRecord(noteData);
      }

      setIsNewNoteOpen(false);
      setFormData({ title: '', subjective: '', objective: '', assessment: '', plan: '', status: 'draft' });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this SOAP note?')) {
      try {
        await deleteRecord(id);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const renderSOAPContent = (content: string) => {
    try {
      const soap = JSON.parse(content);
      return (
        <div className="space-y-2 text-sm">
          {soap.subjective && <p><strong>S:</strong> {soap.subjective.substring(0, 100)}...</p>}
          {soap.objective && <p><strong>O:</strong> {soap.objective.substring(0, 100)}...</p>}
          {soap.assessment && <p><strong>A:</strong> {soap.assessment.substring(0, 100)}...</p>}
          {soap.plan && <p><strong>P:</strong> {soap.plan.substring(0, 100)}...</p>}
        </div>
      );
    } catch {
      return <p className="text-sm text-gray-600">{content.substring(0, 200)}...</p>;
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SOAP Notes</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Clinical Documentation</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">SOAP Notes</span>
          </div>
        </div>
        <Button
          onClick={handleOpenNewNote}
          className="flex items-center gap-2"
          disabled={!selectedPatientId}
        >
          <Plus className="h-4 w-4" /> New SOAP Note
        </Button>
      </div>

      {/* Patient Selection */}
      <PatientSearchSelect
        patients={patients}
        selectedPatientId={selectedPatientId}
        onSelectPatient={setSelectedPatientId}
        loading={patientsLoading}
      />

      {/* SOAP Notes List */}
      {selectedPatientId && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>SOAP Notes ({filteredNotes.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2">Loading SOAP notes...</span>
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ClipboardList className="h-4 w-4 text-blue-500" />
                          <h3 className="font-semibold text-gray-900">{note.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${note.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {note.status}
                          </span>
                        </div>
                        <div className="mb-3">
                          {renderSOAPContent(note.content)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(parseISO(note.record_date), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Provider ID: {note.provider_id}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(note)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-10 border rounded-md">
                <ClipboardList className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <h3 className="font-medium text-lg mb-2">No SOAP notes found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No notes match your search criteria.' : 'Start documenting patient encounters using the SOAP format.'}
                </p>
                <Button onClick={handleOpenNewNote}>
                  Create First SOAP Note
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* New/Edit SOAP Note Dialog */}
      <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? 'Edit SOAP Note' : 'New SOAP Note'}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Subjective, Objective, Assessment, Plan
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Encounter Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Annual Physical, Acute Care Visit"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="subjective">Subjective (S) *</Label>
                <Textarea
                  id="subjective"
                  value={formData.subjective}
                  onChange={(e) => setFormData({ ...formData, subjective: e.target.value })}
                  placeholder="Patient's chief complaint, symptoms, history of present illness..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="objective">Objective (O) *</Label>
                <Textarea
                  id="objective"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="Vital signs, physical examination findings, lab results..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="assessment">Assessment (A) *</Label>
                <Textarea
                  id="assessment"
                  value={formData.assessment}
                  onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                  placeholder="Diagnosis, differential diagnosis, clinical impression..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="plan">Plan (P) *</Label>
                <Textarea
                  id="plan"
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  placeholder="Treatment plan, medications, follow-up, patient education..."
                  rows={4}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNewNoteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingNote ? 'Update SOAP Note' : 'Create SOAP Note'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SOAPNotesPage;
