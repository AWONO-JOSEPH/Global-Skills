import { apiUrl } from "../../lib/api";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import {
  Users, Calendar, FileText, Upload, LogOut, X, Edit, Settings,
  Plus, Camera, ClipboardList, CheckCircle, User, Menu,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { getCurrentAuth, logout } from "../../auth";
import { toast } from "sonner";

type TeacherInfo = {
  id: number; name: string; email: string; specialite?: string; photo?: string;
};
type Formation = {
  id: number; name: string; start_date: string | null;
  capacity: number; enrolled_students: number; price?: number; teacher_id?: number;
};
type Student = {
  id: number; name: string; email: string; matricule: string; formation_id: number;
  formation_name?: string; presence_count: number; total_sessions: number; average_note?: number;
};
type PresenceRecord = { student_id: number; is_present: boolean; date: string; };
type NoteRecord = { student_id: number; note: number; subject?: string; };
type ProgramTracking = {
  id: number; user_id: number; formation_id: number; subject: string; date: string;
  start_time: string; end_time: string; report_content: string;
  teacher_signed_at?: string; admin_signed_at?: string; week_range?: string;
  formation?: { id: number; name: string; };
};

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || localStorage.getItem("teacher_tab") || "students";
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
    localStorage.setItem("teacher_tab", tab);
  };

  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [presenceRecords, setPresenceRecords] = useState<PresenceRecord[]>([]);
  const [noteRecords, setNoteRecords] = useState<NoteRecord[]>([]);
  const [trackings, setTrackings] = useState<ProgramTracking[]>([]);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newTracking, setNewTracking] = useState({
    formation_id: "", subject: "",
    date: new Date().toISOString().split('T')[0],
    start_time: "09:00", end_time: "13:00", report_content: "", week_range: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const loadTeacherData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const auth = getCurrentAuth();
      if (!auth) return;
      
      // Toujours charger le profil
      const teacherResponse = await fetch(apiUrl(`/api/teacher/profile`), { credentials: "include", headers: { Accept: "application/json" } });
      if (teacherResponse.ok) setTeacherInfo(await teacherResponse.json());

      // Chargement conditionnel par onglet
      if (activeTab === "students" || activeTab === "presence" || activeTab === "notes" || activeTab === "courses") {
        const formationsResponse = await fetch(apiUrl(`/api/teacher/formations`), { credentials: "include", headers: { Accept: "application/json" } });
        if (formationsResponse.ok) {
          const formationsData = await formationsResponse.json();
          setFormations(formationsData);
          loadStudentsForFormations(formationsData);
        }
      }

      if (activeTab === "tracking") {
        const trackingsResponse = await fetch(apiUrl(`/api/program-trackings`), { credentials: "include", headers: { Accept: "application/json" } });
        if (trackingsResponse.ok) setTrackings(await trackingsResponse.json());
      }
    } catch (error) { console.error("Erreur lors du chargement des données:", error); }
    finally { if (!silent) setIsLoading(false); }
  }, [activeTab]);

  const loadStudentsForFormations = useCallback(async (formationsList: Formation[]) => {
    if (formationsList.length === 0) return;
    try {
      const allStudents: Student[] = [];
      for (const formation of formationsList) {
        const studentsResponse = await fetch(apiUrl(`/api/formation/${formation.id}/students`), { credentials: "include", headers: { Accept: "application/json" } });
        if (studentsResponse.ok) {
          const formationStudents = await studentsResponse.json();
          allStudents.push(...formationStudents.map((student: any) => ({ ...student, formation_name: formation.name })));
        }
      }
      setStudents(allStudents);
      setPresenceRecords(allStudents.map(s => ({ student_id: s.id, is_present: false, date: new Date().toISOString().split('T')[0] })));
      setNoteRecords(allStudents.map(s => ({ student_id: s.id, note: s.average_note || 0, subject: 'Général' })));
    } catch (error) { console.error("Erreur lors du chargement des étudiants:", error); }
  }, []);

  useEffect(() => {
    const auth = getCurrentAuth();
    if (!auth || auth.role !== "teacher") { logout(); navigate("/login"); return; }
    loadTeacherData();
    const interval = setInterval(() => loadTeacherData(true), 30000);
    return () => clearInterval(interval);
  }, [navigate, loadTeacherData, activeTab]);

  const handleEditStudent = (student: Student) => { setSelectedStudent(student); setEditedStudent({ ...student }); setIsEditDialogOpen(true); };

  const handleSaveStudent = async () => {
    if (!editedStudent) return;
    try {
      const response = await fetch(apiUrl(`/api/students/${editedStudent.id}`), {
        method: 'PUT',
        credentials: "include",
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: editedStudent.name, email: editedStudent.email, matricule: editedStudent.matricule }),
      });
      if (response.ok) { setStudents(students.map(s => s.id === editedStudent.id ? editedStudent : s)); setIsEditDialogOpen(false); toast.success("Informations de l'étudiant mises à jour avec succès"); }
      else toast.error("Erreur lors de la mise à jour de l'étudiant");
    } catch { toast.error("Erreur de connexion"); }
  };

  const handlePresenceChange = (studentId: number, isPresent: boolean) =>
    setPresenceRecords(prev => prev.map(r => r.student_id === studentId ? { ...r, is_present: isPresent } : r));

  const handleNoteChange = (studentId: number, note: number) =>
    setNoteRecords(prev => prev.map(r => r.student_id === studentId ? { ...r, note } : r));

  const handleSavePresence = async () => {
    try {
      const response = await fetch(apiUrl(`/api/teacher/presence`), {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ presences: presenceRecords }),
      });
      if (response.ok) {
        toast.success("Présences enregistrées avec succès");
        setStudents(prev => prev.map(student => {
          const record = presenceRecords.find(r => r.student_id === student.id);
          if (record?.is_present) return { ...student, presence_count: student.presence_count + 1, total_sessions: student.total_sessions + 1 };
          else if (record) return { ...student, total_sessions: student.total_sessions + 1 };
          return student;
        }));
      } else toast.error("Erreur lors de l'enregistrement des présences");
    } catch { toast.error("Erreur de connexion"); }
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(apiUrl(`/api/teacher/notes`), {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ notes: noteRecords }),
      });
      if (response.ok) {
        toast.success("Notes enregistrées avec succès");
        setStudents(prev => prev.map(student => {
          const record = noteRecords.find(r => r.student_id === student.id);
          return record ? { ...student, average_note: record.note } : student;
        }));
      } else toast.error("Erreur lors de l'enregistrement des notes");
    } catch { toast.error("Erreur de connexion"); }
  };

  const handleSaveTracking = async () => {
    try {
      const response = await fetch(apiUrl("/api/program-trackings"), {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(newTracking),
      });
      if (response.ok) {
        const saved = await response.json();
        setTrackings([saved, ...trackings]);
        setIsTrackingDialogOpen(false);
        setNewTracking({ formation_id: "", subject: "", date: new Date().toISOString().split('T')[0], start_time: "09:00", end_time: "13:00", report_content: "", week_range: "" });
        toast.success("Fiche de suivi enregistrée avec succès");
      } else { const err = await response.json(); toast.error(err.message || "Erreur lors de l'enregistrement"); }
    } catch { toast.error("Erreur de connexion"); }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !teacherInfo) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const auth = getCurrentAuth();
      if (!auth) return;
      const response = await fetch(apiUrl("/api/profile/photo"), { method: 'POST', body: formData, credentials: "include" });
      if (response.ok) { 
        const data = await response.json(); 
        setTeacherInfo(prev => prev ? { ...prev, photo: data.photo } : null); 
        toast.success("Photo de profil mise à jour avec succès"); 
      }
      else toast.error("Erreur lors du téléchargement de la photo");
    } catch { toast.error("Erreur de connexion"); }
  };

  if (isLoading || !teacherInfo) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-primary" />
          <p className="text-sm text-gray-400 font-medium">Chargement…</p>
        </div>
      </div>
    );
  }

  const tabItems = [
    { value: "students", label: "Étudiants", icon: Users },
    { value: "presence", label: "Présences", icon: CheckCircle },
    { value: "notes", label: "Notes", icon: FileText },
    { value: "courses", label: "Formations", icon: Calendar },
    { value: "tracking", label: "Suivi", icon: ClipboardList },
  ];

  const EmptyState = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <div className="p-4 bg-gray-50 rounded-2xl mb-2"><Icon className="h-8 w-8 text-gray-300" /></div>
      <p className="text-gray-500 font-semibold">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm text-center max-w-xs">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {selectedFormation && (
        <div
          className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedFormation(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Détails formation</p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{selectedFormation.name}</h3>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedFormation(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-400">Début</span>
                <span className="font-semibold text-gray-800">
                  {selectedFormation.start_date ? new Date(selectedFormation.start_date).toLocaleDateString("fr-FR") : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-400">Capacité</span>
                <span className="font-semibold text-gray-800">
                  {selectedFormation.enrolled_students}/{selectedFormation.capacity}
                </span>
              </div>
              {typeof selectedFormation.price === "number" && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-400">Prix</span>
                  <span className="font-semibold text-gray-800">{selectedFormation.price.toLocaleString("fr-FR")} FCFA</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-primary sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="h-9 w-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-sm tracking-wide">GS</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-white font-bold text-sm tracking-wider">GLOBAL SKILLS</p>
              <p className="text-white/60 text-[10px] uppercase tracking-widest">Espace Formateur</p>
            </div>
            <p className="sm:hidden text-white font-bold text-sm tracking-widest">FORMATEUR</p>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/settings">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg h-9 px-3 text-sm font-medium">
                <Settings className="h-4 w-4 mr-1.5" />Paramètres
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg h-9 px-3 text-sm font-medium"
              onClick={() => { logout(); navigate("/login"); }}>
              <LogOut className="h-4 w-4 mr-1.5" />Déconnexion
            </Button>
          </nav>

          <button className="sm:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/10 bg-primary">
            <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-col gap-1">
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all">
                  <Settings className="h-4 w-4" /><span className="text-sm font-medium">Paramètres</span>
                </div>
              </Link>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all w-full"
                onClick={() => { logout(); navigate("/login"); }}>
                <LogOut className="h-4 w-4" /><span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative flex-shrink-0 group">
              <img
                src={teacherInfo.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherInfo.name)}&background=f97316&color=fff`}
                alt={teacherInfo.name}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover cursor-pointer border border-gray-100 hover:opacity-90 transition-opacity"
                onClick={() => {
                  const img = new Image();
                  img.src = teacherInfo.photo || '';
                  img.onload = () => {
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
                    modal.onclick = () => modal.remove();
                    const modalImg = document.createElement('img');
                    modalImg.src = img.src;
                    modalImg.className = 'max-w-full max-h-full rounded-2xl';
                    modal.appendChild(modalImg);
                    document.body.appendChild(modal);
                  };
                }}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-7 w-7 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{teacherInfo.name}</h2>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">Formateur</p>
              {teacherInfo.specialite && (
                <span className="inline-block mt-2 text-xs font-semibold text-accent bg-accent/8 px-3 py-1 rounded-full">
                  {teacherInfo.specialite}
                </span>
              )}
            </div>
            <Button variant="outline" size="sm"
              onClick={() => navigate("/settings")}
              className="flex-shrink-0 border-gray-100 hover:border-accent/30 hover:bg-accent/5 rounded-xl h-9 px-3 text-sm">
              <User className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Mon Profil</span>
            </Button>
          </div>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>

          {/* Desktop strip */}
          <div className="hidden sm:block mb-5">
            <TabsList className="bg-white border border-gray-100 shadow-sm rounded-2xl p-1.5 h-auto w-full flex gap-1">
              {tabItems.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 flex-1 transition-all duration-200
                    data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-gray-700 hover:bg-gray-50">
                  <Icon className="h-4 w-4" /><span>{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Mobile chips */}
          <div className="sm:hidden mb-4">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-base font-bold text-gray-800">{tabItems.find(t => t.value === activeTab)?.label}</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabItems.map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setActiveTab(value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold flex-shrink-0 transition-all duration-200 border
                    ${activeTab === value ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-gray-500 border-gray-100"}`}>
                  <Icon className="h-3.5 w-3.5" />{label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB: STUDENTS */}
          <TabsContent value="students">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 p-5 border-b border-gray-50">
                <div className="p-2.5 bg-primary/8 rounded-xl"><Users className="h-5 w-5 text-primary" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Liste des Étudiants</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Étudiants inscrits dans vos formations</p>
                </div>
              </div>
              <div className="p-5">
                {students.length === 0 ? <EmptyState icon={Users} title="Aucun étudiant trouvé" subtitle="Aucun étudiant inscrit dans vos formations pour le moment." /> : (
                  <>
                    {/* Mobile cards */}
                    <div className="sm:hidden space-y-3">
                      {students.map((student) => (
                        <div key={student.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-primary text-xs font-bold">{student.name?.[0]?.toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                                <p className="text-xs text-gray-400">{student.matricule}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${student.presence_count / student.total_sessions >= 0.9 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-600'}`}>
                              {student.presence_count}/{student.total_sessions}
                            </span>
                          </div>
                          <div className="space-y-1 pl-11 text-xs">
                            <div className="flex justify-between"><span className="text-gray-400">Formation</span><span className="font-medium text-gray-700 truncate ml-2 max-w-[150px]">{student.formation_name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Moyenne</span><span className="font-bold text-gray-800">{student.average_note ? `${student.average_note}/20` : 'N/A'}</span></div>
                          </div>
                          <div className="pl-11">
                            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-gray-100 hover:border-primary/30 hover:bg-primary/5 w-full" onClick={() => handleEditStudent(student)}>
                              <Edit className="h-3.5 w-3.5 mr-1.5" />Modifier
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-50 hover:bg-transparent">
                            {["Nom", "Email", "Matricule", "Formation", "Présence", "Moyenne", "Actions"].map(h => (
                              <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                              <TableCell className="font-medium text-gray-900 text-sm">{student.name}</TableCell>
                              <TableCell className="text-gray-500 text-sm">{student.email}</TableCell>
                              <TableCell className="text-gray-500 text-sm">{student.matricule}</TableCell>
                              <TableCell className="text-gray-500 text-sm">{student.formation_name}</TableCell>
                              <TableCell>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${student.presence_count / student.total_sessions >= 0.9 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-600'}`}>
                                  {student.presence_count}/{student.total_sessions}
                                </span>
                              </TableCell>
                              <TableCell className="font-semibold text-gray-800 text-sm">{student.average_note ? `${student.average_note}/20` : '—'}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-gray-100 hover:border-primary/30 hover:bg-primary/5" onClick={() => handleEditStudent(student)}>
                                  <Edit className="h-3.5 w-3.5 mr-1.5" />Modifier
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB: PRESENCE */}
          <TabsContent value="presence">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 p-5 border-b border-gray-50">
                <div className="p-2.5 bg-emerald-50 rounded-xl"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Gestion des Présences</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="p-5">
                {students.length === 0 ? <EmptyState icon={CheckCircle} title="Aucun étudiant à marquer" /> : (
                  <>
                    <div className="sm:hidden space-y-3 mb-5">
                      {students.map((student) => {
                        const record = presenceRecords.find(r => r.student_id === student.id);
                        return (
                          <div key={student.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-primary text-xs font-bold">{student.name?.[0]?.toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                                <p className="text-xs text-gray-400">{student.matricule}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handlePresenceChange(student.id, true)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border font-bold text-sm
                                  ${record?.is_present ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white text-gray-400 border-gray-200'}`}>✓</button>
                              <button onClick={() => handlePresenceChange(student.id, false)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border font-bold text-sm
                                  ${!record?.is_present ? 'bg-red-500 text-white border-red-500 shadow-sm' : 'bg-white text-gray-400 border-gray-200'}`}>✕</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="hidden sm:block overflow-x-auto mb-5">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-50 hover:bg-transparent">
                            {["Étudiant", "Matricule", "Formation", "Présent", "Absent"].map(h => (
                              <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => {
                            const record = presenceRecords.find(r => r.student_id === student.id);
                            return (
                              <TableRow key={student.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium text-gray-900 text-sm">{student.name}</TableCell>
                                <TableCell className="text-gray-500 text-sm">{student.matricule}</TableCell>
                                <TableCell className="text-gray-500 text-sm">{student.formation_name}</TableCell>
                                <TableCell>
                                  <button onClick={() => handlePresenceChange(student.id, true)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border
                                      ${record?.is_present ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white text-gray-300 border-gray-200 hover:border-emerald-200'}`}>
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                </TableCell>
                                <TableCell>
                                  <button onClick={() => handlePresenceChange(student.id, false)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border
                                      ${!record?.is_present ? 'bg-red-500 text-white border-red-500 shadow-sm' : 'bg-white text-gray-300 border-gray-200 hover:border-red-200'}`}>
                                    <X className="h-4 w-4" />
                                  </button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-5 text-sm font-medium shadow-sm" onClick={handleSavePresence} disabled={students.length === 0}>
                      Enregistrer les présences
                    </Button>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB: NOTES */}
          <TabsContent value="notes">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 p-5 border-b border-gray-50">
                <div className="p-2.5 bg-primary/8 rounded-xl"><FileText className="h-5 w-5 text-primary" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Saisie des Notes</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Entrez les notes de vos étudiants</p>
                </div>
              </div>
              <div className="p-5">
                {students.length === 0 ? <EmptyState icon={FileText} title="Aucun étudiant à noter" /> : (
                  <>
                    <div className="sm:hidden space-y-3 mb-5">
                      {students.map((student) => {
                        const record = noteRecords.find(r => r.student_id === student.id);
                        return (
                          <div key={student.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-primary text-xs font-bold">{student.name?.[0]?.toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                                <p className="text-xs text-gray-400">{student.formation_name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Input type="number" placeholder="—"
                                className="w-20 h-9 text-sm rounded-xl border-gray-200 text-center font-semibold"
                                value={record?.note || ''} min="0" max="20"
                                onChange={(e) => handleNoteChange(student.id, parseFloat(e.target.value) || 0)} />
                              <span className="text-xs text-gray-400">/20</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="hidden sm:block overflow-x-auto mb-5">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-50 hover:bg-transparent">
                            {["Étudiant", "Matricule", "Formation", "Note /20", ""].map((h, i) => (
                              <TableHead key={i} className="text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => {
                            const record = noteRecords.find(r => r.student_id === student.id);
                            return (
                              <TableRow key={student.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium text-gray-900 text-sm">{student.name}</TableCell>
                                <TableCell className="text-gray-500 text-sm">{student.matricule}</TableCell>
                                <TableCell className="text-gray-500 text-sm">{student.formation_name}</TableCell>
                                <TableCell>
                                  <Input type="number" placeholder="—"
                                    className="w-24 h-9 text-sm rounded-xl border-gray-200 text-center font-semibold"
                                    value={record?.note || ''} min="0" max="20"
                                    onChange={(e) => handleNoteChange(student.id, parseFloat(e.target.value) || 0)} />
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-gray-100 hover:border-primary/30 hover:bg-primary/5" onClick={handleSaveNotes}>
                                    Enregistrer
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-5 text-sm font-medium shadow-sm" onClick={handleSaveNotes} disabled={students.length === 0}>
                      Enregistrer toutes les notes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB: COURSES */}
          <TabsContent value="courses">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 p-5 border-b border-gray-50">
                <div className="p-2.5 bg-secondary/8 rounded-xl"><Calendar className="h-5 w-5 text-secondary" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Mes Formations</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Vos formations assignées par l'administrateur</p>
                </div>
              </div>
              <div className="p-5">
                {formations.length === 0 ? <EmptyState icon={Calendar} title="Aucune formation assignée" subtitle="Aucune formation assignée pour le moment." /> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formations.map((formation) => (
                      <div key={formation.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm leading-snug">{formation.name}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0 h-7 text-xs rounded-lg border-gray-100 hover:border-secondary/30 hover:bg-secondary/5"
                            onClick={() => setSelectedFormation(formation)}
                          >
                            Détails
                          </Button>
                        </div>
                        <div className="space-y-1 text-xs text-gray-500">
                          <p>{formation.start_date ? `Début : ${new Date(formation.start_date).toLocaleDateString("fr-FR")}` : "Date non définie"}</p>
                          <div className="flex items-center justify-between">
                            <span>{formation.enrolled_students}/{formation.capacity} étudiants</span>
                            {formation.price && <span className="font-semibold text-primary">{formation.price.toLocaleString("fr-FR")} FCFA</span>}
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${Math.min((formation.enrolled_students / formation.capacity) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB: TRACKING */}
          <TabsContent value="tracking">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-accent/8 rounded-xl"><ClipboardList className="h-5 w-5 text-accent" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900">Fiches de Suivi</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Historique et saisie de vos rapports de cours</p>
                  </div>
                </div>
                <Button onClick={() => setIsTrackingDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl h-9 px-4 text-sm font-medium shadow-sm flex-shrink-0">
                  <Plus className="h-4 w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Nouvelle Fiche</span>
                </Button>
              </div>
              <div className="p-5">
                {trackings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 border-2 border-dashed border-gray-100 rounded-2xl">
                    <div className="p-4 bg-gray-50 rounded-2xl"><ClipboardList className="h-8 w-8 text-gray-300" /></div>
                    <p className="text-gray-500 font-semibold">Aucune fiche enregistrée</p>
                    <Button variant="link" onClick={() => setIsTrackingDialogOpen(true)} className="text-primary text-sm font-semibold h-auto p-0">Créer votre première fiche →</Button>
                  </div>
                ) : (
                  <>
                    <div className="sm:hidden space-y-3">
                      {trackings.map((tracking) => (
                        <div key={tracking.id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{tracking.formation?.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{tracking.subject}</p>
                            </div>
                            {tracking.admin_signed_at ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />Validé
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">En attente</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{new Date(tracking.date).toLocaleDateString("fr-FR")}</span>
                            <span>·</span>
                            <span>{tracking.start_time.substring(0, 5)} – {tracking.end_time.substring(0, 5)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-50 hover:bg-transparent">
                            {["Date", "Formation", "Matière", "Horaire", "Rapport", "Statut"].map(h => (
                              <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trackings.map((tracking) => (
                            <TableRow key={tracking.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                              <TableCell className="font-medium text-gray-900 text-sm">{new Date(tracking.date).toLocaleDateString("fr-FR")}</TableCell>
                              <TableCell className="text-gray-600 text-sm">{tracking.formation?.name}</TableCell>
                              <TableCell className="text-gray-600 text-sm">{tracking.subject}</TableCell>
                              <TableCell className="text-gray-500 text-sm">{tracking.start_time.substring(0, 5)} – {tracking.end_time.substring(0, 5)}</TableCell>
                              <TableCell className="text-gray-500 text-sm max-w-xs truncate">{tracking.report_content}</TableCell>
                              <TableCell>
                                {tracking.admin_signed_at ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1 w-fit">
                                    <CheckCircle className="h-3 w-3" />Validé
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100 w-fit block">En attente</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* TRACKING DIALOG */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Nouvelle Fiche de Suivi</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">Remplissez les informations sur le cours dispensé.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Formation</label>
              <select className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                value={newTracking.formation_id} onChange={(e) => setNewTracking({...newTracking, formation_id: e.target.value})}>
                <option value="">Sélectionnez une formation</option>
                {formations.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Matière dispensée</label>
              <Input className="h-10 rounded-xl border-gray-200 text-sm" value={newTracking.subject}
                onChange={(e) => setNewTracking({...newTracking, subject: e.target.value})}
                placeholder="Ex: Word, Excel, Informatique…" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</label>
              <Input type="date" className="h-10 rounded-xl border-gray-200 text-sm" value={newTracking.date}
                onChange={(e) => setNewTracking({...newTracking, date: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Semaine (optionnel)</label>
              <Input className="h-10 rounded-xl border-gray-200 text-sm" value={newTracking.week_range}
                onChange={(e) => setNewTracking({...newTracking, week_range: e.target.value})}
                placeholder="Ex: Semaine du 23 au 27 Fév 2026" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Heure début</label>
              <Input type="time" className="h-10 rounded-xl border-gray-200 text-sm" value={newTracking.start_time}
                onChange={(e) => setNewTracking({...newTracking, start_time: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Heure fin</label>
              <Input type="time" className="h-10 rounded-xl border-gray-200 text-sm" value={newTracking.end_time}
                onChange={(e) => setNewTracking({...newTracking, end_time: e.target.value})} />
            </div>
            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Rapport synthétique du cours</label>
              <textarea className="w-full min-h-[100px] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none"
                value={newTracking.report_content}
                onChange={(e) => setNewTracking({...newTracking, report_content: e.target.value})}
                placeholder="Décrivez brièvement le contenu du cours, les chapitres abordés, les TP réalisés…" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl border-gray-200" onClick={() => setIsTrackingDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveTracking} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm">
              <CheckCircle className="h-4 w-4 mr-2" />Signer et Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT STUDENT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Modifier l'étudiant</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">Mettez à jour les informations de {editedStudent?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { label: "Nom complet", key: "name", type: "text", placeholder: "Nom de l'étudiant" },
              { label: "Email", key: "email", type: "email", placeholder: "Email de l'étudiant" },
              { label: "Matricule", key: "matricule", type: "text", placeholder: "Matricule de l'étudiant" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</label>
                <Input type={type} className="h-10 rounded-xl border-gray-200 text-sm"
                  value={(editedStudent as any)?.[key] || ''}
                  onChange={(e) => setEditedStudent(prev => prev ? { ...prev, [key]: e.target.value } : null)}
                  placeholder={placeholder} />
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl border-gray-200" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveStudent} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm">Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}