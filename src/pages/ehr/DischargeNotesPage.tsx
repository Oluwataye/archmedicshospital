import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Plus, FileText, Loader2, Calendar, User, LogOut } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { usePatientManagement } from '@/hooks/usePatientManagement';
import { useAuth } from '@/contexts/AuthContext';
import PatientSearchSelect from '@/components/common/PatientSearchSelect';

const DischargeNotesPage = () => {
  const { user } = useAuth();
  const { patients, loading: patientsLoading } = usePatientManagement();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const { records, loading, createRecord, updateRecord, deleteRecord, getRecordsByType } = useMedicalRecords(selectedPatientId);

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    admissionDate: '',
    dischargeDate: '',
    admissionDiagnosis: '',
    dischargeDiagnosis: '',
    hospitalCourse: '',
    proceduresPerformed: '',
    dischargeCondition: '',
    dischargeMedications: '',
    followUpInstructions: '',
    dischargeDisposition: 'home',
    status: 'draft',
  });

  const dischargeNotes = getRecordsByType('discharge');

  const filteredNotes = dischargeNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewNote = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      admissionDate: '',
      dischargeDate: new Date().toISOString().split('T')[0],
      admissionDiagnosis: '',
      dischargeDiagnosis: '',
      hospitalCourse: '',
      proceduresPerformed: '',
      dischargeCondition: '',
      dischargeMedications: '',
      followUpInstructions: '',
      dischargeDisposition: 'home',
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
        admissionDate: content.admissionDate || '',
        dischargeDate: content.dischargeDate || '',
        admissionDiagnosis: content.admissionDiagnosis || '',
        dischargeDiagnosis: content.dischargeDiagnosis || '',
        hospitalCourse: content.hospitalCourse || '',
        proceduresPerformed: content.proceduresPerformed || '',
        dischargeCondition: content.dischargeCondition || '',
        dischargeMedications: content.dischargeMedications || '',
        followUpInstructions: content.followUpInstructions || '',
        dischargeDisposition: content.dischargeDisposition || 'home',
        status: note.status,
      });
    } catch {
      setFormData({
        title: note.title,
        admissionDate: '',
        dischargeDate: '',
        admissionDiagnosis: '',
        dischargeDiagnosis: '',
        hospitalCourse: '',
        proceduresPerformed: '',
        dischargeCondition: '',
        dischargeMedications: '',
        followUpInstructions: '',
        dischargeDisposition: 'home',
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
      const dischargeContent = {
        admissionDate: formData.admissionDate,
        dischargeDate: formData.dischargeDate,
        admissionDiagnosis: formData.admissionDiagnosis,
        dischargeDiagnosis: formData.dischargeDiagnosis,
        hospitalCourse: formData.hospitalCourse,
        proceduresPerformed: formData.proceduresPerformed,
        dischargeCondition: formData.dischargeCondition,
        dischargeMedications: formData.dischargeMedications,
        followUpInstructions: formData.followUpInstructions,
        dischargeDisposition: formData.dischargeDisposition,
      };

      const noteData = {
        patient_id: selectedPatientId,
        provider_id: user?.id || '',
        record_type: 'discharge',
        record_date: formData.dischargeDate || new Date().toISOString().split('T')[0],
        title: formData.title,
        content: JSON.stringify(dischargeContent),
        status: formData.status,
      };

      if (editingNote) {
        await updateRecord(editingNote.id, noteData);
      } else {
        await createRecord(noteData);
      }

      setIsNewNoteOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this discharge note?')) {
      try {
        await deleteRecord(id);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const renderDischargeContent = (content: string) => {
    try {
      const discharge = JSON.parse(content);
      return (
        <div className="space-y-2 text-sm">
          {discharge.dischargeDiagnosis && (
            <p><strong>Discharge Diagnosis:</strong> {discharge.dischargeDiagnosis.substring(0, 100)}...</p>
          )}
          {discharge.dischargeDisposition && (
            <p><strong>Disposition:</strong> {discharge.dischargeDisposition}</p>
          )}
          {discharge.dischargeDate && (
            <p><strong>Discharge Date:</strong> {format(parseISO(discharge.dischargeDate), 'MMM dd, yyyy')}</p>
          )}
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
          <h1 className="text-2xl font-bold text-gray-800">Discharge Notes</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Clinical Documentation</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Discharge Notes</span>
          </div>
        </div>
        <Button
          onClick={handleOpenNewNote}
          className="flex items-center gap-2"
          disabled={!selectedPatientId}
        >
          <Plus className="h-4 w-4" /> New Discharge Note
        </Button>
      </div>

      {/* Patient Selection */}
      <PatientSearchSelect
        patients={patients}
        selectedPatientId={selectedPatientId}
        onSelectPatient={setSelectedPatientId}
        loading={patientsLoading}
      />

      {/* Discharge Notes List */}
      {selectedPatientId && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Discharge Summaries ({filteredNotes.length})</CardTitle>
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
                <span className="ml-2">Loading discharge notes...</span>
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <LogOut className="h-4 w-4 text-blue-500" />
                          <h3 className="font-semibold text-gray-900">{note.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${note.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {note.status}
                          </span>
                        </div>
                        <div className="mb-3">
                          {renderDischargeContent(note.content)}
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
                <LogOut className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <h3 className="font-medium text-lg mb-2">No discharge notes found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No notes match your search criteria.' : 'Create discharge summaries for patient transitions.'}
                </p>
                <Button onClick={handleOpenNewNote}>
                  Create First Discharge Note
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* New/Edit Discharge Note Dialog */}
      <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? 'Edit Discharge Summary' : 'New Discharge Summary'}
            </DialogTitle>
            <DialogDescription>
              {editingNote ? 'Edit the details of the existing discharge summary.' : 'Create a new discharge summary for the patient.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Discharge Summary Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Discharge Summary - Pneumonia Treatment"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="admissionDate">Admission Date *</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dischargeDate">Discharge Date *</Label>
                <Input
                  id="dischargeDate"
                  type="date"
                  value={formData.dischargeDate}
                  onChange={(e) => setFormData({ ...formData, dischargeDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="admissionDiagnosis">Admission Diagnosis *</Label>
              <Textarea
                id="admissionDiagnosis"
                value={formData.admissionDiagnosis}
                onChange={(e) => setFormData({ ...formData, admissionDiagnosis: e.target.value })}
                placeholder="Primary and secondary diagnoses on admission..."
                rows={2}
                required
              />
            </div>

            <div>
              <Label htmlFor="dischargeDiagnosis">Discharge Diagnosis *</Label>
              <Textarea
                id="dischargeDiagnosis"
                value={formData.dischargeDiagnosis}
                onChange={(e) => setFormData({ ...formData, dischargeDiagnosis: e.target.value })}
                placeholder="Final diagnoses at discharge..."
                rows={2}
                required
              />
            </div>

            <div>
              <Label htmlFor="hospitalCourse">Hospital Course *</Label>
              <Textarea
                id="hospitalCourse"
                value={formData.hospitalCourse}
                onChange={(e) => setFormData({ ...formData, hospitalCourse: e.target.value })}
                placeholder="Summary of patient's hospital stay, treatments, and progress..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="proceduresPerformed">Procedures Performed</Label>
              <Textarea
                id="proceduresPerformed"
                value={formData.proceduresPerformed}
                onChange={(e) => setFormData({ ...formData, proceduresPerformed: e.target.value })}
                placeholder="List of procedures, surgeries, or interventions..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="dischargeCondition">Discharge Condition *</Label>
              <Input
                id="dischargeCondition"
                value={formData.dischargeCondition}
                onChange={(e) => setFormData({ ...formData, dischargeCondition: e.target.value })}
                placeholder="e.g., Stable, Improved, Good"
                required
              />
            </div>

            <div>
              <Label htmlFor="dischargeMedications">Discharge Medications *</Label>
              <Textarea
                id="dischargeMedications"
                value={formData.dischargeMedications}
                onChange={(e) => setFormData({ ...formData, dischargeMedications: e.target.value })}
                placeholder="List of medications prescribed at discharge with dosages..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="followUpInstructions">Follow-up Instructions *</Label>
              <Textarea
                id="followUpInstructions"
                value={formData.followUpInstructions}
                onChange={(e) => setFormData({ ...formData, followUpInstructions: e.target.value })}
                placeholder="Follow-up appointments, activity restrictions, diet, etc..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="dischargeDisposition">Discharge Disposition *</Label>
              <Select value={formData.dischargeDisposition} onValueChange={(value) => setFormData({ ...formData, dischargeDisposition: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="home_health">Home with Home Health</SelectItem>
                  <SelectItem value="rehab">Rehabilitation Facility</SelectItem>
                  <SelectItem value="nursing_home">Nursing Home</SelectItem>
                  <SelectItem value="hospice">Hospice</SelectItem>
                  <SelectItem value="ama">Against Medical Advice</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                </SelectContent>
              </Select>
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
                {editingNote ? 'Update Discharge Summary' : 'Create Discharge Summary'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DischargeNotesPage;
