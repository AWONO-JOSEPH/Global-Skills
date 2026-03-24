import { apiUrl } from "../../lib/api";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import {
  Users,
  Calendar,
  FileText,
  Upload,
  LogOut,
  X,
  Edit,
  Settings,
  Plus,
  Camera,
  ClipboardList,
  CheckCircle,
  User,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getCurrentAuth, logout } from "../../auth";
import { toast } from "sonner";

type TeacherInfo = {
  id: number;
  name: string;
  email: string;
  specialite?: string;
  photo?: string;
};

type Formation = {
  id: number;
  name: string;
  start_date: string | null;
  capacity: number;
  enrolled_students: number;
  price?: number;
  teacher_id?: number;
};

type Student = {
  id: number;
  name: string;
  email: string;
  matricule: string;
  formation_id: number;
  formation_name?: string;
  presence_count: number;
  total_sessions: number;
  average_note?: number;
};

type PresenceRecord = {
  student_id: number;
  is_present: boolean;
  date: string;
};

type NoteRecord = {
  student_id: number;
  note: number;
  subject?: string;
};

type ProgramTracking = {
  id: number;
  user_id: number;
  formation_id: number;
  subject: string;
  date: string;
  start_time: string;
  end_time: string;
  report_content: string;
  teacher_signed_at?: string;
  admin_signed_at?: string;
  week_range?: string;
  formation?: {
    id: number;
    name: string;
  };
};

export default function TeacherDashboard() {
  const navigate = useNavigate();
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
  const [newTracking, setNewTracking] = useState({
    formation_id: "",
    subject: "",
    date: new Date().toISOString().split('T')[0],
    start_time: "09:00",
    end_time: "13:00",
    report_content: "",
    week_range: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = getCurrentAuth();
    if (!auth || auth.role !== "teacher") {
      logout();
      navigate("/login");
      return;
    }

    loadTeacherData();
  }, [navigate]);

  const loadTeacherData = async () => {
    setIsLoading(true);
    try {
      const auth = getCurrentAuth();
      if (!auth) return;

      const emailParam = `?email=${encodeURIComponent(auth.email)}`;

      // Charger les infos du formateur
      const teacherResponse = await fetch(apiUrl(`/api/teacher/profile${emailParam}`), {
        headers: { Accept: "application/json" },
      });
      
      if (teacherResponse.ok) {
        const teacherData = await teacherResponse.json();
        setTeacherInfo(teacherData);
      }

      // Charger les formations du formateur
      const formationsResponse = await fetch(apiUrl(`/api/teacher/formations${emailParam}`), {
        headers: { Accept: "application/json" },
      });
      
      if (formationsResponse.ok) {
        const formationsData = await formationsResponse.json();
        setFormations(formationsData);

        // Charger les étudiants des formations du formateur
        loadStudentsForFormations(formationsData, auth.email);
      }

      // Charger les fiches de suivi
      const trackingsResponse = await fetch(apiUrl(`/api/program-trackings?email=${encodeURIComponent(auth.email)}`), {
        headers: { Accept: "application/json" },
      });
      
      if (trackingsResponse.ok) {
        const trackingsData = await trackingsResponse.json();
        setTrackings(trackingsData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentsForFormations = async (formationsList: Formation[], teacherEmail: string) => {
    if (formationsList.length === 0) return;
    
    try {
      const allStudents: Student[] = [];
      const emailParam = `?email=${encodeURIComponent(teacherEmail)}`;

      for (const formation of formationsList) {
        const studentsResponse = await fetch(apiUrl(`/api/formation/${formation.id}/students${emailParam}`), {
          headers: { Accept: "application/json" },
        });
        
        if (studentsResponse.ok) {
          const formationStudents = await studentsResponse.json();
          allStudents.push(...formationStudents.map((student: any) => ({
            ...student,
            formation_name: formation.name,
          })));
        }
      }
      setStudents(allStudents);
      
      // Initialiser les enregistrements de présence et notes
      setPresenceRecords(allStudents.map(student => ({
        student_id: student.id,
        is_present: false,
        date: new Date().toISOString().split('T')[0],
      })));
      
      setNoteRecords(allStudents.map(student => ({
        student_id: student.id,
        note: student.average_note || 0,
        subject: 'Général',
      })));
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error);
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditedStudent({ ...student });
    setIsEditDialogOpen(true);
  };

  const handleSaveStudent = async () => {
    if (!editedStudent) return;

    try {
      const auth = getCurrentAuth();
      if (!auth) return;

      const response = await fetch(apiUrl(`/api/students/${editedStudent.id}?email=${encodeURIComponent(auth.email)}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: editedStudent.name,
          email: editedStudent.email,
          matricule: editedStudent.matricule,
        }),
      });

      if (response.ok) {
        setStudents(students.map(s => s.id === editedStudent.id ? editedStudent : s));
        setIsEditDialogOpen(false);
        toast.success("Informations de l'étudiant mises à jour avec succès");
      } else {
        toast.error("Erreur lors de la mise à jour de l'étudiant");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const handlePresenceChange = (studentId: number, isPresent: boolean) => {
    setPresenceRecords(prev => 
      prev.map(record => 
        record.student_id === studentId ? { ...record, is_present: isPresent } : record
      )
    );
  };

  const handleNoteChange = (studentId: number, note: number) => {
    setNoteRecords(prev => 
      prev.map(record => 
        record.student_id === studentId ? { ...record, note } : record
      )
    );
  };

  const handleSavePresence = async () => {
    try {
      const auth = getCurrentAuth();
      if (!auth) return;

      const response = await fetch(apiUrl(`/api/teacher/presence?email=${encodeURIComponent(auth.email)}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ presences: presenceRecords }),
      });

      if (response.ok) {
        toast.success("Présences enregistrées avec succès");
        // Mettre à jour les compteurs de présence
        setStudents(prev => prev.map(student => {
          const record = presenceRecords.find(r => r.student_id === student.id);
          if (record && record.is_present) {
            return {
              ...student,
              presence_count: student.presence_count + 1,
              total_sessions: student.total_sessions + 1,
            };
          } else if (record) {
            return {
              ...student,
              total_sessions: student.total_sessions + 1,
            };
          }
          return student;
        }));
      } else {
        toast.error("Erreur lors de l'enregistrement des présences");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const handleSaveNotes = async () => {
    try {
      const auth = getCurrentAuth();
      if (!auth) return;

      const response = await fetch(apiUrl(`/api/teacher/notes?email=${encodeURIComponent(auth.email)}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ notes: noteRecords }),
      });

      if (response.ok) {
        toast.success("Notes enregistrées avec succès");
        // Mettre à jour les notes moyennes
        setStudents(prev => prev.map(student => {
          const record = noteRecords.find(r => r.student_id === student.id);
          if (record) {
            return { ...student, average_note: record.note };
          }
          return student;
        }));
      } else {
        toast.error("Erreur lors de l'enregistrement des notes");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const handleSaveTracking = async () => {
    try {
      const auth = getCurrentAuth();
      if (!auth) return;

      const response = await fetch(apiUrl("/api/program-trackings"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...newTracking,
          email: auth.email,
        }),
      });

      if (response.ok) {
        const saved = await response.json();
        setTrackings([saved, ...trackings]);
        setIsTrackingDialogOpen(false);
        setNewTracking({
          formation_id: "",
          subject: "",
          date: new Date().toISOString().split('T')[0],
          start_time: "09:00",
          end_time: "13:00",
          report_content: "",
          week_range: "",
        });
        toast.success("Fiche de suivi enregistrée avec succès");
      } else {
        const err = await response.json();
        toast.error(err.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !teacherInfo) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const auth = getCurrentAuth();
      if (!auth) return;

      formData.append('email', auth.email);

      const response = await fetch(apiUrl("/api/teacher/profile-picture"), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTeacherInfo(prev => prev ? { ...prev, photo: data.avatar_url } : null);
        toast.success("Photo de profil mise à jour avec succès");
      } else {
        toast.error("Erreur lors du téléchargement de la photo");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  if (isLoading || !teacherInfo) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">GS</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">GLOBAL SKILLS</h1>
                <p className="text-xs text-white/80">Espace Formateur</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/settings">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Paramètres</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </div>
              {/* Mobile menu button */}
              <div className="sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => {
                    const menu = document.getElementById('teacher-mobile-menu');
                    if (menu) {
                      menu.classList.toggle('hidden');
                    }
                  }}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            </div>
            {/* Mobile menu */}
            <div id="teacher-mobile-menu" className="hidden sm:hidden absolute top-full left-0 right-0 bg-primary border-t border-white/20">
              <div className="px-4 py-2 space-y-1">
                <Link to="/settings" className="block w-full">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 w-full justify-start"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Teacher Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative group flex-shrink-0">
              <img 
                src={teacherInfo.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherInfo.name)}&background=f97316&color=fff`} 
                alt={teacherInfo.name} 
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover cursor-pointer transition-transform hover:scale-105 border-2 border-gray-100"
                onClick={() => {
                  const img = new Image();
                  img.src = teacherInfo.photo || '';
                  img.onload = () => {
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
                    modal.onclick = () => modal.remove();
                    
                    const modalImg = document.createElement('img');
                    modalImg.src = img.src;
                    modalImg.className = 'max-w-full max-h-full rounded-lg';
                    
                    modal.appendChild(modalImg);
                    document.body.appendChild(modal);
                  };
                }}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{teacherInfo.name}</h2>
              <p className="text-sm text-gray-600 mb-2">Formateur</p>
              {teacherInfo.specialite && (
                <Badge className="bg-accent text-white">{teacherInfo.specialite}</Badge>
              )}
            </div>
            <Button variant="outline" className="border-gray-200 hover:border-accent hover:bg-accent/5">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Mon Profil</span>
              <span className="sm:hidden">Profil</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="students" className="data-[state=active]:bg-accent data-[state=active]:text-white transition-all duration-300">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Étudiants</span>
              <span className="sm:hidden">Étud.</span>
            </TabsTrigger>
            <TabsTrigger value="presence" className="data-[state=active]:bg-accent data-[state=active]:text-white transition-all duration-300">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Présences</span>
              <span className="sm:hidden">Prés.</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-accent data-[state=active]:text-white transition-all duration-300">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notes</span>
              <span className="sm:hidden">Not.</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-accent data-[state=active]:text-white transition-all duration-300">
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Mes Cours</span>
              <span className="sm:hidden">Cours</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-accent data-[state=active]:text-white transition-all duration-300">
              <ClipboardList className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Suivi</span>
              <span className="sm:hidden">Suiv.</span>
            </TabsTrigger>
          </TabsList>

          {/* Mobile Navigation Indicator */}
          <div className="sm:hidden mb-4">
            <div className="bg-gray-100 rounded-lg p-1">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Glissez pour naviguer</span>
                <span>→</span>
              </div>
            </div>
          </div>

          <TabsContent value="students" className="animate-in slide-in-from-right-5 duration-300">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold text-gray-900">Liste des Étudiants</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Étudiants inscrits dans vos formations</p>
              </div>
              <div className="p-4 sm:p-6">
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun étudiant inscrit dans vos formations pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-3">
                      {students.map((student) => (
                        <div key={student.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{student.name}</h4>
                              <p className="text-sm text-gray-600">{student.matricule}</p>
                            </div>
                            <Badge variant={student.presence_count / student.total_sessions >= 0.9 ? "default" : "secondary"} className="bg-accent text-white">
                              {student.presence_count}/{student.total_sessions}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span className="text-gray-900 truncate ml-2">{student.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Formation:</span>
                              <span className="text-gray-900 truncate ml-2">{student.formation_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Moyenne:</span>
                              <span className="font-semibold text-gray-900 ml-2">
                                {student.average_note ? `${student.average_note}/20` : 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full border-gray-200 hover:border-accent hover:bg-accent/5"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <Table className="min-w-[800px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="hidden sm:table-cell">Nom</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead>Matricule</TableHead>
                            <TableHead className="hidden lg:table-cell">Formation</TableHead>
                            <TableHead className="hidden md:table-cell">Présence</TableHead>
                            <TableHead className="hidden md:table-cell">Note Moyenne</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium sm:table-cell">{student.name}</TableCell>
                              <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                              <TableCell>{student.matricule}</TableCell>
                              <TableCell className="hidden lg:table-cell">{student.formation_name}</TableCell>
                              <TableCell>
                                <Badge variant={student.presence_count / student.total_sessions >= 0.9 ? "default" : "secondary"}>
                                  {student.presence_count}/{student.total_sessions}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell font-semibold">
                                {student.average_note ? `${student.average_note}/20` : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-gray-200 hover:border-accent hover:bg-accent/5"
                                  onClick={() => handleEditStudent(student)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Modifier
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presence" className="animate-in slide-in-from-right-5 duration-300">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold text-gray-900">Gestion des Présences</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Marquez la présence de vos étudiants pour aujourd'hui</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Date: {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {students.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun étudiant à marquer présent.
                  </p>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="hidden sm:table-cell">Étudiant</TableHead>
                            <TableHead>Matricule</TableHead>
                            <TableHead className="hidden md:table-cell">Formation</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Présent</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Absent</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => {
                            const record = presenceRecords.find(r => r.student_id === student.id);
                            return (
                              <TableRow key={student.id}>
                                <TableCell className="font-medium sm:table-cell">{student.name}</TableCell>
                                <TableCell>{student.matricule}</TableCell>
                                <TableCell className="hidden md:table-cell">{student.formation_name}</TableCell>
                                <TableCell className="text-center">
                                  <Button 
                                    variant={record?.is_present ? "default" : "outline"} 
                                    size="sm" 
                                    className={record?.is_present ? "text-green-600 border-green-600" : ""}
                                    onClick={() => handlePresenceChange(student.id, true)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button 
                                    variant={!record?.is_present ? "default" : "outline"} 
                                    size="sm" 
                                    className={!record?.is_present ? "text-red-600 border-red-600" : ""}
                                    onClick={() => handlePresenceChange(student.id, false)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4">
                      <Button 
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleSavePresence}
                        disabled={students.length === 0}
                      >
                        Enregistrer les Présences
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="animate-in slide-in-from-right-5 duration-300">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold text-gray-900">Saisie des Notes</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Entrez les notes de vos étudiants</p>
              </div>
              <div className="p-4 sm:p-6">
                {students.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun étudiant à noter.
                  </p>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="hidden sm:table-cell">Étudiant</TableHead>
                            <TableHead>Matricule</TableHead>
                            <TableHead className="hidden md:table-cell">Formation</TableHead>
                            <TableHead className="hidden md:table-cell">Note /20</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => {
                            const record = noteRecords.find(r => r.student_id === student.id);
                            return (
                              <TableRow key={student.id}>
                                <TableCell className="font-medium sm:table-cell">{student.name}</TableCell>
                                <TableCell>{student.matricule}</TableCell>
                                <TableCell className="hidden md:table-cell">{student.formation_name}</TableCell>
                                <TableCell>
                                  <Input 
                                    type="number" 
                                    placeholder="Note" 
                                    className="w-24" 
                                    value={record?.note || ''}
                                    onChange={(e) => handleNoteChange(student.id, parseFloat(e.target.value) || 0)}
                                    min="0" 
                                    max="20" 
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleSaveNotes}
                                  >
                                    Enregistrer
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4">
                      <Button 
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleSaveNotes}
                        disabled={students.length === 0}
                      >
                        Enregistrer toutes les Notes
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="animate-in slide-in-from-right-5 duration-300">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold text-gray-900">Mes Formations</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Vos formations assignées par l'administrateur</p>
              </div>
              <div className="p-4 sm:p-6">
                  {formations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Aucune formation assignée pour le moment.
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {formations.map((formation) => (
                        <div key={formation.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold mb-2">{formation.name}</h4>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>
                                  {formation.start_date
                                    ? `Début: ${new Date(formation.start_date).toLocaleDateString("fr-FR")}`
                                    : "Date non définie"}
                                </p>
                                <p>
                                  {formation.enrolled_students}/{formation.capacity} étudiants inscrits
                                </p>
                                {formation.price && (
                                  <p className="font-medium text-primary">
                                    Prix: {formation.price.toLocaleString("fr-FR")} FCFA
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Détails</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="animate-in slide-in-from-right-5 duration-300">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-semibold text-gray-900">Fiches de Suivi des Programmes</h3>
                  </div>
                  <Button onClick={() => setIsTrackingDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Nouvelle Fiche</span>
                    <span className="sm:hidden">+</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">Historique et saisie de vos rapports de cours</p>
              </div>
              <div className="p-4 sm:p-6">
                {trackings.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune fiche de suivi enregistrée.</p>
                    <Button 
                      variant="link" 
                      onClick={() => setIsTrackingDialogOpen(true)}
                      className="text-primary mt-2"
                    >
                      Créer votre première fiche maintenant
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Formation</TableHead>
                          <TableHead>Matière</TableHead>
                          <TableHead className="hidden md:table-cell">Horaire</TableHead>
                          <TableHead className="hidden lg:table-cell">Rapport</TableHead>
                          <TableHead>Statut Admin</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trackings.map((tracking) => (
                          <TableRow key={tracking.id}>
                            <TableCell className="font-medium">
                              {new Date(tracking.date).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell>{tracking.formation?.name}</TableCell>
                            <TableCell>{tracking.subject}</TableCell>
                            <TableCell className="hidden md:table-cell">{tracking.start_time.substring(0, 5)} - {tracking.end_time.substring(0, 5)}</TableCell>
                            <TableCell className="hidden lg:table-cell max-w-xs truncate">
                              {tracking.report_content}
                            </TableCell>
                            <TableCell>
                              {tracking.admin_signed_at ? (
                                <Badge className="bg-green-500 text-white flex items-center gap-1 w-fit">
                                  <CheckCircle className="h-3 w-3" /> Validé
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 flex items-center gap-1 w-fit">
                                  <Calendar className="h-3 w-3" /> En attente
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Fiche de Suivi des Programmes</DialogTitle>
            <DialogDescription>
              Remplissez les informations sur le cours dispensé.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Formation</label>
              <select 
                className="w-full h-10 border rounded-md px-3 text-sm"
                value={newTracking.formation_id}
                onChange={(e) => setNewTracking({...newTracking, formation_id: e.target.value})}
              >
                <option value="">Sélectionnez une formation</option>
                {formations.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Matière dispensée</label>
              <Input 
                value={newTracking.subject}
                onChange={(e) => setNewTracking({...newTracking, subject: e.target.value})}
                placeholder="Ex: Initiation Informatique, Word, Excel..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input 
                type="date"
                value={newTracking.date}
                onChange={(e) => setNewTracking({...newTracking, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Semaine (Optionnel)</label>
              <Input 
                value={newTracking.week_range}
                onChange={(e) => setNewTracking({...newTracking, week_range: e.target.value})}
                placeholder="Ex: Semaine du 23 au 27 Février 2026"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Heure début</label>
              <Input 
                type="time"
                value={newTracking.start_time}
                onChange={(e) => setNewTracking({...newTracking, start_time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Heure fin</label>
              <Input 
                type="time"
                value={newTracking.end_time}
                onChange={(e) => setNewTracking({...newTracking, end_time: e.target.value})}
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Rapport synthétique du cours</label>
              <textarea 
                className="w-full min-h-[100px] border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newTracking.report_content}
                onChange={(e) => setNewTracking({...newTracking, report_content: e.target.value})}
                placeholder="Décrivez brièvement le contenu du cours, les chapitres abordés, les TP réalisés..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveTracking} className="bg-primary hover:bg-primary/90 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Signer et Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les informations de l'étudiant</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de {editedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom complet</label>
              <Input
                value={editedStudent?.name || ''}
                onChange={(e) => setEditedStudent(prev => prev ? {...prev, name: e.target.value} : null)}
                placeholder="Nom de l'étudiant"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={editedStudent?.email || ''}
                onChange={(e) => setEditedStudent(prev => prev ? {...prev, email: e.target.value} : null)}
                placeholder="Email de l'étudiant"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Matricule</label>
              <Input
                value={editedStudent?.matricule || ''}
                onChange={(e) => setEditedStudent(prev => prev ? {...prev, matricule: e.target.value} : null)}
                placeholder="Matricule de l'étudiant"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveStudent}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
