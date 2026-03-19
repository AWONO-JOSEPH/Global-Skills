import { apiUrl } from "../../lib/api";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  LogOut,
  Settings,
  FileText,
  BarChart3,
  Download,
  Newspaper,
  Globe,
  MessageSquare,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from "recharts";
import { getCurrentAuth, logout } from "../../auth";
import { toast } from "sonner";

type OverviewStats = {
  total_students: number;
  total_teachers: number;
  total_admins: number;
  total_formations: number;
  monthly_success_rate: number;
  monthly_revenue: number;
  new_messages?: number;
  new_international_requests?: number;
};

type EnrollmentPoint = { month: string; students: number };
type RevenuePoint = { month: string; revenue: number };

type RecentStudent = {
  nom: string;
  formation: string | null;
  date: string | null;
  statut: string;
};

type RecentPayment = {
  etudiant: string;
  montant: string;
  type: string;
  date: string;
  statut: string;
};

type StudentRow = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  formation_id?: number | null;
  formation?: { id: number; name: string } | null;
};

type TeacherRow = { id: number; name: string; email: string; phone?: string; specialite?: string; created_at?: string };

type FormationRow = {
  id: number;
  name: string;
  start_date: string | null;
  capacity: number;
  enrolled_students: number;
  price?: number;
  teacher_id?: number | null;
  teacher?: { id: number; name: string } | null;
};

type PaymentRow = {
  id: number;
  etudiant: string;
  montant: number;
  type: string;
  date: string;
  statut: string;
  is_partial?: boolean;
  remaining?: number;
  formation_price?: number;
  total_paid_so_far?: number;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentPoint[]>([]);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentRole, setNewStudentRole] = useState<"student" | "teacher">("student");
  const [newStudentFormationId, setNewStudentFormationId] = useState<number | "">("");
  const [formations, setFormations] = useState<FormationRow[]>([]);
  const [isLoadingFormations, setIsLoadingFormations] = useState(false);
  const [isSavingFormation, setIsSavingFormation] = useState(false);
  const [isFormationDialogOpen, setIsFormationDialogOpen] = useState(false);
  const [formationMode, setFormationMode] = useState<"create" | "view" | "edit">("create");
  const [activeFormation, setActiveFormation] = useState<FormationRow | null>(null);
  const [formationName, setFormationName] = useState("");
  const [formationStartDate, setFormationStartDate] = useState("");
  const [formationCapacity, setFormationCapacity] = useState<number>(0);
  const [formationEnrolled, setFormationEnrolled] = useState<number>(0);
  const [formationPrice, setFormationPrice] = useState<number>(0);
  const [formationTeacherId, setFormationTeacherId] = useState<number | "">("");
  const [isFormationStudentsDialogOpen, setIsFormationStudentsDialogOpen] = useState(false);
  const [formationStudents, setFormationStudents] = useState<any[]>([]);
  const [selectedFormationName, setSelectedFormationName] = useState("");
  const [isLoadingFormationStudents, setIsLoadingFormationStudents] = useState(false);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [studentDialogMode, setStudentDialogMode] = useState<"view" | "edit">("view");
  const [activeStudent, setActiveStudent] = useState<StudentRow | null>(null);
  const [editStudentName, setEditStudentName] = useState("");
  const [editStudentEmail, setEditStudentEmail] = useState("");
  const [editStudentPhone, setEditStudentPhone] = useState("");
  const [editStudentFormationId, setEditStudentFormationId] = useState<number | "">("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentStudentId, setPaymentStudentId] = useState<number | null>(null);
  const [paymentFormationId, setPaymentFormationId] = useState<number | "">("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  // Payment view dialog state
  const [isViewPaymentDialogOpen, setIsViewPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRow | null>(null);

  const handleConfirmPayment = async (paymentId: number) => {
    try {
      const response = await fetch(apiUrl(`/api/admin/payments/${paymentId}/confirm`), {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Erreur");

      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, statut: "Payé" } : p))
      );
      toast.success("Paiement confirmé.");

      // Recharger les listes pour mettre à jour les calculs de tranches
      const paymentsRes = await fetch(apiUrl("/api/admin/payments"));
      if (paymentsRes.ok) {
        const pData = await paymentsRes.json();
        setPayments(pData);
      }

      const r = await fetch(apiUrl("/api/admin/overview"), {
        headers: { Accept: "application/json" },
      });
      if (r.ok) {
        const d = await r.json();
        setStats(d.stats);
        setRevenueData(d.revenueData ?? []);
        setRecentPayments(d.recentPayments ?? []);
      }
    } catch {
      toast.error("Erreur lors de la confirmation.");
    }
  };

  const openViewPaymentDialog = (payment: PaymentRow) => {
    setSelectedPayment(payment);
    setIsViewPaymentDialogOpen(true);
  };

  // Teacher dialog state
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [teacherDialogMode, setTeacherDialogMode] = useState<"view" | "edit">("view");
  const [activeTeacher, setActiveTeacher] = useState<TeacherRow | null>(null);
  const [editTeacherName, setEditTeacherName] = useState("");
  const [editTeacherEmail, setEditTeacherEmail] = useState("");
  const [editTeacherSpecialite, setEditTeacherSpecialite] = useState("");
  const [editTeacherPhone, setEditTeacherPhone] = useState("");

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.")) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/admin/students/${studentId}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'étudiant");
      }

      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast.success("Étudiant supprimé avec succès.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression.");
    }
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action est irréversible.")) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/admin/teachers/${teacherId}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'enseignant");
      }

      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      toast.success("Enseignant supprimé avec succès.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression.");
    }
  };

  const openTeacherDialog = (mode: "view" | "edit", teacher?: TeacherRow) => {
    setTeacherDialogMode(mode);
    setActiveTeacher(teacher ?? null);
    if (teacher) {
      setEditTeacherName(teacher.name);
      setEditTeacherEmail(teacher.email);
      setEditTeacherSpecialite(teacher.specialite || "");
      setEditTeacherPhone(teacher.phone || "");
    } else {
      setEditTeacherName("");
      setEditTeacherEmail("");
      setEditTeacherSpecialite("");
      setEditTeacherPhone("");
    }
    setIsTeacherDialogOpen(true);
  };

  useEffect(() => {
    const auth = getCurrentAuth();
    if (!auth || auth.role !== "admin") {
      logout();
      navigate("/login");
      return;
    }

    const loadOverview = async () => {
      setIsLoadingOverview(true);
      try {
        const response = await fetch(apiUrl("/api/admin/overview"), {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement du tableau de bord");
        }

        const data = await response.json();
        setStats(data.stats);
        setEnrollmentData(data.enrollmentData ?? []);
        setRevenueData(data.revenueData ?? []);
        setRecentStudents(data.recentStudents ?? []);
        setRecentPayments(data.recentPayments ?? []);
      } catch {
        // on laisse le tableau vide
      } finally {
        setIsLoadingOverview(false);
      }
    };

    loadOverview();
  }, [navigate]);

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const response = await fetch(apiUrl("/api/admin/students"), {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des étudiants");
        }

        const data: StudentRow[] = await response.json();
        setStudents(data);
      } catch {
        // on laisse la liste vide
      } finally {
        setIsLoadingStudents(false);
      }
    };

    loadStudents();
  }, []);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const res = await fetch(apiUrl("/api/admin/teachers"), {
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setTeachers(data);
        }
      } catch {
        // ignore
      }
    };
    loadTeachers();
  }, []);

  useEffect(() => {
    const loadPayments = async () => {
      setIsLoadingPayments(true);
      try {
        const res = await fetch(apiUrl("/api/admin/payments"), {
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingPayments(false);
      }
    };
    loadPayments();
  }, []);

  useEffect(() => {
    const loadFormations = async () => {
      setIsLoadingFormations(true);
      try {
        const response = await fetch(apiUrl("/api/admin/formations"), {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des formations");
        }

        const data: FormationRow[] = await response.json();
        setFormations(data);
      } catch {
        // on laisse la liste vide
      } finally {
        setIsLoadingFormations(false);
      }
    };

    loadFormations();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;

    setIsCreatingStudent(true);
    try {
      const response = await fetch(apiUrl("/api/admin/users"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: newStudentName,
          email: newStudentEmail,
          phone: newStudentPhone,
          role: newStudentRole,
          formation_id: newStudentRole === "student" ? (newStudentFormationId || null) : null,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message ?? "Erreur lors de la création de l'étudiant");
      }

      const created: StudentRow = await response.json();
      const createdFormationId = newStudentFormationId;
      if (newStudentRole === "student") {
        setStudents((prev) => [created, ...prev]);
      } else {
        setTeachers((prev) => [created, ...prev]);
      }
      setNewStudentName("");
      setNewStudentEmail("");
      setNewStudentPhone("");
      setNewStudentRole("student");
      setNewStudentFormationId("");
      const roleText = newStudentRole === "student" ? "étudiant" : "enseignant";
      toast.success(`${roleText.charAt(0).toUpperCase() + roleText.slice(1)} créé. Un email avec le mot de passe temporaire a été envoyé.`);

      const loadOverview = async () => {
        try {
          const r = await fetch(apiUrl("/api/admin/overview"), {
            headers: { Accept: "application/json" },
          });
          if (r.ok) {
            const d = await r.json();
            setStats(d.stats);
            setRecentStudents(d.recentStudents ?? []);
            setRecentPayments(d.recentPayments ?? []);
          }
        } catch {
          /* ignore */
        }
      };
      loadOverview();

      setPaymentStudentId(created.id);
      setPaymentFormationId(createdFormationId || "");
      const formation = formations.find((f) => f.id === createdFormationId);
      setPaymentTotal(formation?.price ?? 0);
      setPaymentAmount("");
      setIsPaymentDialogOpen(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création.");
    } finally {
      setIsCreatingStudent(false);
    }
  };

  const openStudentDialog = (mode: "view" | "edit", student?: StudentRow) => {
    setStudentDialogMode(mode);
    setActiveStudent(student ?? null);
    if (student) {
      setEditStudentName(student.name);
      setEditStudentEmail(student.email);
      setEditStudentPhone(student.phone || "");
      setEditStudentFormationId(student.formation_id ?? "");
    } else {
      setEditStudentName("");
      setEditStudentEmail("");
      setEditStudentPhone("");
      setEditStudentFormationId("");
    }
    setIsStudentDialogOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;

    setIsSavingStudent(true);
    try {
      const response = await fetch(apiUrl(`/api/admin/students/${activeStudent.id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: editStudentName,
          email: editStudentEmail,
          phone: editStudentPhone,
          formation_id: editStudentFormationId || null,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message ?? "Erreur lors de la mise à jour");
      }

      const updated: StudentRow = await response.json();
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setIsStudentDialogOpen(false);
      toast.success("Étudiant mis à jour.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setIsSavingStudent(false);
    }
  };

  const openPaymentDialogForStudent = (student: StudentRow) => {
    setPaymentStudentId(student.id);
    setPaymentFormationId(student.formation_id ?? "");
    const formation = formations.find((f) => f.id === (student.formation_id ?? 0));
    setPaymentTotal(formation?.price ?? 0);
    setPaymentAmount("");
    setIsPaymentDialogOpen(true);
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentStudentId || !paymentAmount || isNaN(Number(paymentAmount))) return;

    setIsSavingPayment(true);
    try {
      const response = await fetch(apiUrl("/api/admin/payments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: paymentStudentId,
          formation_id: paymentFormationId || null,
          amount: parseInt(paymentAmount, 10),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message ?? "Erreur lors de l'enregistrement du paiement");
      }

      const newPayment = await response.json();
      setPayments((prev) => [
        {
          id: newPayment.id,
          etudiant: students.find((s) => s.id === paymentStudentId)?.name ?? "",
          montant: parseInt(paymentAmount, 10),
          type: formations.find((f) => f.id === paymentFormationId)?.name ?? "Paiement",
          date: new Date().toLocaleDateString("fr-FR"),
          statut: "En attente",
        },
        ...prev,
      ]);
      setIsPaymentDialogOpen(false);
      setPaymentStudentId(null);
      toast.success("Paiement enregistré. Statut: En attente.");

      const r = await fetch(apiUrl("/api/admin/overview"), {
        headers: { Accept: "application/json" },
      });
      if (r.ok) {
        const d = await r.json();
        setRecentPayments(d.recentPayments ?? []);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setIsSavingPayment(false);
    }
  };

  const openFormationDialog = (mode: "create" | "view" | "edit", formation?: FormationRow) => {
    setFormationMode(mode);
    setActiveFormation(formation ?? null);
    if (formation) {
      setFormationName(formation.name);
      setFormationStartDate(
        formation.start_date ? formation.start_date.substring(0, 10) : ""
      );
      setFormationCapacity(formation.capacity);
      setFormationEnrolled(formation.enrolled_students);
      setFormationPrice(formation.price ?? 0);
      setFormationTeacherId(formation.teacher_id ?? "");
    } else {
      setFormationName("");
      setFormationStartDate("");
      setFormationCapacity(0);
      setFormationEnrolled(0);
      setFormationPrice(0);
      setFormationTeacherId("");
    }
    setIsFormationDialogOpen(true);
  };

  const openFormationStudentsDialog = async (formation: FormationRow) => {
    setSelectedFormationName(formation.name);
    setIsFormationStudentsDialogOpen(true);
    setIsLoadingFormationStudents(true);
    try {
      const response = await fetch(apiUrl(`/api/admin/formations/${formation.id}/students`));
      if (response.ok) {
        const data = await response.json();
        setFormationStudents(data);
      } else {
        toast.error("Impossible de charger la liste des étudiants.");
      }
    } catch (err) {
      toast.error("Erreur de connexion.");
    } finally {
      setIsLoadingFormationStudents(false);
    }
  };

  const handleSaveFormation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formationName) return;

    setIsSavingFormation(true);
    try {
      const payload = {
        name: formationName,
        start_date: formationStartDate || null,
        capacity: formationCapacity,
        enrolled_students: formationEnrolled,
        price: formationPrice,
        teacher_id: formationTeacherId || null,
      };

      let response: Response;
      if (formationMode === "edit" && activeFormation) {
        response = await fetch(
          apiUrl(`/api/admin/formations/${activeFormation.id}`),
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(apiUrl("/api/admin/formations"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de la formation");
      }

      const saved: FormationRow = await response.json();

      if (formationMode === "edit") {
        setFormations((prev) =>
          prev.map((f) => (f.id === saved.id ? saved : f))
        );
      } else {
        setFormations((prev) => [saved, ...prev]);
      }

      setIsFormationDialogOpen(false);
    } catch {
      // on pourrait afficher un toast d'erreur ici
    } finally {
      setIsSavingFormation(false);
    }
  };

  const handleDeleteFormation = async () => {
    if (!activeFormation) return;
    if (!confirm("Supprimer cette formation ?")) return;

    try {
      const response = await fetch(
        apiUrl(`/api/admin/formations/${activeFormation.id}`),
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok && response.status !== 204) {
        throw new Error("Erreur lors de la suppression de la formation");
      }

      setFormations((prev) =>
        prev.filter((f) => f.id !== activeFormation.id)
      );
      setIsFormationDialogOpen(false);
    } catch {
      // on pourrait afficher un toast d'erreur ici
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">GS</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">GLOBAL SKILLS</h1>
                <p className="text-xs text-white/80">Panneau d'Administration</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/admin/news">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Newspaper className="h-4 w-4 mr-2" />
                  Actualités
                </Button>
              </Link>
              <Link to="/admin/international-requests">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 relative">
                  <Globe className="h-4 w-4 mr-2" />
                  International
                  {stats?.new_international_requests ? (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                      {stats.new_international_requests > 9 ? "9+" : stats.new_international_requests}
                    </span>
                  ) : null}
                </Button>
              </Link>
              <Link to="/admin/contact-messages">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 relative">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                  {stats?.new_messages ? (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                      {stats.new_messages > 9 ? "9+" : stats.new_messages}
                    </span>
                  ) : null}
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
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
                  Déconnexion
                </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
            <TabsTrigger value="teachers">Enseignants</TabsTrigger>
            <TabsTrigger value="formations">Formations</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Étudiants
                      </CardTitle>
                    <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                  <div className="text-3xl font-bold mb-1">
                    {stats ? stats.total_students : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Nombre d'étudiants inscrits
                  </p>
                  </CardContent>
                </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Formations Actives
                    </CardTitle>
                    <GraduationCap className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">
                    {stats ? stats.total_formations : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formations actuellement ouvertes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Revenus ce Mois
                    </CardTitle>
                    <DollarSign className="h-5 w-5 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">
                    {stats ? `${stats.monthly_revenue.toLocaleString("fr-FR")} FCFA` : "0 FCFA"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Basé sur les paiements enregistrés
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-100 bg-red-50/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-red-800">
                      Nouveaux Messages
                    </CardTitle>
                    <MessageSquare className="h-5 w-5 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1 text-red-700">
                    {stats?.new_messages ?? 0}
                  </div>
                  <Link to="/admin/contact-messages" className="text-xs text-red-600 hover:underline">
                    Voir les messages de contact
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-blue-800">
                      Demandes Internationales
                    </CardTitle>
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1 text-blue-700">
                    {stats?.new_international_requests ?? 0}
                  </div>
                  <Link to="/admin/international-requests" className="text-xs text-blue-600 hover:underline">
                    Voir les demandes de projets
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Taux de Réussite
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">
                    {stats ? `${stats.monthly_success_rate}%` : "0%"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Indicateur global (en cours de définition)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inscriptions Mensuelles</CardTitle>
                  <CardDescription>Évolution du nombre d'inscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="students" fill="#1e3a8a" name="Étudiants" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenus Mensuels</CardTitle>
                  <CardDescription>Évolution des revenus (milliers FCFA)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} name="Revenus" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-accent" />
                    Inscriptions Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoadingOverview && recentStudents.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Chargement des inscriptions récentes...
                      </p>
                    )}
                    {!isLoadingOverview && recentStudents.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Aucune inscription pour le moment.
                      </p>
                    )}
                    {recentStudents.map((student, index) => (
                      <div key={index} className="flex items-center justify-between pb-3 border-b last:border-0">
                        <div>
                          <p className="font-medium">{student.nom}</p>
                          {student.formation && (
                          <p className="text-sm text-muted-foreground">{student.formation}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500 text-white mb-1">{student.statut}</Badge>
                          {student.date && (
                          <p className="text-xs text-muted-foreground">{student.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    Paiements Récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoadingOverview && recentPayments.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Chargement des paiements récents...
                      </p>
                    )}
                    {!isLoadingOverview && recentPayments.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Aucun paiement enregistré pour le moment.
                      </p>
                    )}
                    {recentPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between pb-3 border-b last:border-0">
                        <div>
                          <p className="font-medium">{payment.etudiant}</p>
                          <p className="text-sm text-muted-foreground">{payment.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-accent">{payment.montant}</p>
                          <Badge className={payment.statut === "Payé" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                            {payment.statut}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestion des Étudiants</CardTitle>
                    <CardDescription>Liste complète des étudiants inscrits</CardDescription>
                  </div>
                  <Button
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => {
                      const container = document.getElementById("new-student-form");
                      if (container) {
                        container.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouvel Étudiant
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  id="new-student-form"
                  className="mb-6 p-4 border rounded-lg bg-muted/40 space-y-4"
                >
                  <h3 className="font-semibold text-sm">
                    Créer un nouvel utilisateur
                  </h3>
                  <form
                    onSubmit={handleCreateStudent}
                    className="flex flex-col md:flex-row gap-3 md:items-end"
                  >
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1">
                        Rôle
                      </label>
                      <select
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={newStudentRole}
                        onChange={(e) => setNewStudentRole(e.target.value as "student" | "teacher")}
                        required
                      >
                        <option value="student">Étudiant</option>
                        <option value="teacher">Enseignant</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="Nom de l'utilisateur"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        placeholder="email@exemple.com"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                        placeholder="Ex: 677..."
                      />
                    </div>
                    {newStudentRole === "student" && (
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1">
                          Formation
                        </label>
                        <select
                          className="w-full border rounded-md px-3 py-2 text-sm"
                          value={newStudentFormationId}
                          onChange={(e) =>
                            setNewStudentFormationId(
                              e.target.value ? parseInt(e.target.value, 10) : ""
                            )
                          }
                        >
                          <option value="">— Aucune —</option>
                          {formations.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="flex-1">
                      <Button type="submit" disabled={isCreatingStudent}>
                        {isCreatingStudent ? "Création..." : "Enregistrer"}
                      </Button>
                    </div>
                  </form>
                </div>

                {isLoadingStudents && students.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Chargement des étudiants...
                  </p>
                ) : null}

                {!isLoadingStudents && students.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun étudiant pour le moment.
                  </p>
                ) : null}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Formation</TableHead>
                      <TableHead>Date d'Inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {student.formation?.name ?? "—"}
                        </TableCell>
                        <TableCell>
                          {student.created_at
                            ? new Date(student.created_at).toLocaleDateString("fr-FR")
                            : ""}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-accent border-accent hover:bg-accent hover:text-white"
                              onClick={() => openPaymentDialogForStudent(student)}
                            >
                              Paiement
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openStudentDialog("view", student)}
                            >
                              Voir
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openStudentDialog("edit", student)}
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {studentDialogMode === "view" ? "Détails de l'étudiant" : "Modifier l'étudiant"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveStudent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={editStudentName}
                      onChange={(e) => setEditStudentName(e.target.value)}
                      disabled={studentDialogMode === "view"}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={editStudentEmail}
                      onChange={(e) => setEditStudentEmail(e.target.value)}
                      disabled={studentDialogMode === "view"}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Téléphone</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={editStudentPhone}
                      onChange={(e) => setEditStudentPhone(e.target.value)}
                      disabled={studentDialogMode === "view"}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Formation</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={editStudentFormationId}
                      onChange={(e) =>
                        setEditStudentFormationId(
                          e.target.value ? parseInt(e.target.value, 10) : ""
                        )
                      }
                      disabled={studentDialogMode === "view"}
                    >
                      <option value="">— Aucune —</option>
                      {formations.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {studentDialogMode === "edit" && (
                    <DialogFooter>
                      <Button type="submit" disabled={isSavingStudent}>
                        {isSavingStudent ? "Enregistrement..." : "Enregistrer"}
                      </Button>
                    </DialogFooter>
                  )}
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enregistrer un paiement</DialogTitle>
                  <DialogDescription>
                    Indiquez le montant versé par l'étudiant
                    {paymentTotal > 0 && ` (Total formation: ${paymentTotal.toLocaleString("fr-FR")} FCFA)`}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSavePayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Formation</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={paymentFormationId}
                      onChange={(e) => {
                        const v = e.target.value ? parseInt(e.target.value, 10) : "";
                        setPaymentFormationId(v);
                        const f = formations.find((x) => x.id === v);
                        setPaymentTotal(f?.price ?? 0);
                      }}
                    >
                      <option value="">— Aucune —</option>
                      {formations.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.price?.toLocaleString("fr-FR") ?? 0} FCFA)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Montant versé (FCFA)</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSavingPayment}>
                      {isSavingPayment ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Gestion des Enseignants</CardTitle>
                  <CardDescription>Liste complète des enseignants</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {teachers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun enseignant pour le moment.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Spécialité</TableHead>
                        <TableHead>Date d'Inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">
                            {teacher.name}
                          </TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>{teacher.specialite || "—"}</TableCell>
                          <TableCell>
                            {teacher.created_at
                              ? new Date(teacher.created_at).toLocaleDateString("fr-FR")
                              : ""}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openTeacherDialog("view", teacher)}
                              >
                                Voir
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openTeacherDialog("edit", teacher)}
                              >
                                Modifier
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteTeacher(teacher.id)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formations Tab */}
          <TabsContent value="formations">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestion des Formations</CardTitle>
                    <CardDescription>Gérez les formations et les inscriptions</CardDescription>
                  </div>
                  <Button
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => openFormationDialog("create")}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Nouvelle Formation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingFormations && formations.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Chargement des formations...
                    </p>
                  )}
                  {!isLoadingFormations && formations.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Aucune formation pour le moment.
                    </p>
                  )}
                  {formations.map((formation) => {
                    const percent =
                      formation.capacity > 0
                        ? Math.round(
                            (formation.enrolled_students / formation.capacity) * 100
                          )
                        : 0;
                    return (
                      <div key={formation.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-bold text-lg">{formation.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Début:{" "}
                              {formation.start_date
                                ? new Date(formation.start_date).toLocaleDateString(
                                    "fr-FR"
                                  )
                                : "Non défini"}
                            </p>
                            {formation.teacher && (
                              <p className="text-sm text-muted-foreground">
                                Formateur: {formation.teacher.name}
                              </p>
                            )}
                            {formation.price && (
                              <p className="text-sm font-medium text-primary">
                                Prix: {formation.price.toLocaleString("fr-FR")} FCFA
                              </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {formation.enrolled_students}/{formation.capacity}
                            </p>
                          <p className="text-xs text-muted-foreground">Étudiants inscrits</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Taux de remplissage</span>
                            <span>{percent}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                              style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openFormationDialog("view", formation)}
                          >
                            Voir Détails
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openFormationDialog("edit", formation)}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openFormationStudentsDialog(formation)}
                          >
                            Liste Étudiants
                          </Button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Dialog open={isFormationDialogOpen} onOpenChange={setIsFormationDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {formationMode === "create"
                      ? "Nouvelle formation"
                      : formationMode === "edit"
                      ? "Modifier la formation"
                      : "Détails de la formation"}
                  </DialogTitle>
                  <DialogDescription>
                    Gérez les informations de la formation et les capacités
                    d&apos;accueil.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSaveFormation} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Nom de la formation
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={formationName}
                      onChange={(e) => setFormationName(e.target.value)}
                      disabled={formationMode === "view"}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={formationStartDate}
                      onChange={(e) => setFormationStartDate(e.target.value)}
                      disabled={formationMode === "view"}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Formateur
                    </label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={formationTeacherId}
                      onChange={(e) =>
                        setFormationTeacherId(
                          e.target.value ? parseInt(e.target.value, 10) : ""
                        )
                      }
                      disabled={formationMode === "view"}
                    >
                      <option value="">— Sélectionner un formateur —</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Prix (FCFA)
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={formationPrice}
                      onChange={(e) =>
                        setFormationPrice(parseInt(e.target.value || "0", 10))
                      }
                      disabled={formationMode === "view"}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Capacité (places)
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={formationCapacity}
                        onChange={(e) =>
                          setFormationCapacity(parseInt(e.target.value || "0", 10))
                        }
                        disabled={formationMode === "view"}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Étudiants inscrits
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={formationEnrolled}
                        onChange={(e) =>
                          setFormationEnrolled(parseInt(e.target.value || "0", 10))
                        }
                        disabled={formationMode === "view"}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    {formationMode === "edit" && activeFormation && (
                      <Button
                        type="button"
                        variant="outline"
                        className="mr-auto text-red-600"
                        onClick={handleDeleteFormation}
                      >
                        Supprimer
                      </Button>
                    )}
                    {formationMode !== "view" && (
                      <Button type="submit" disabled={isSavingFormation}>
                        {isSavingFormation ? "Enregistrement..." : "Enregistrer"}
                      </Button>
                    )}
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  Gestion des Paiements
                </CardTitle>
                <CardDescription>Suivi des paiements et facturation</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.etudiant}</TableCell>
                        <TableCell className="font-semibold text-accent">
                          {typeof payment.montant === 'number' 
                            ? (payment.montant as number).toLocaleString('fr-FR') + ' FCFA'
                            : payment.montant}
                        </TableCell>
                        <TableCell>{payment.type}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge className={payment.statut === "Payé" ? "bg-green-500 text-white w-fit" : "bg-yellow-500 text-white w-fit"}>
                              {payment.statut}
                            </Badge>
                            {payment.statut === "Payé" && (
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${payment.is_partial ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                {payment.is_partial ? 'Tranche' : 'Complet'}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openViewPaymentDialog(payment)}>Voir</Button>
                            {payment.statut === "En attente" && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600"
                                onClick={() => handleConfirmPayment(payment.id)}
                              >
                                Confirmer
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Rapports et Statistiques
                  </CardTitle>
                  <CardDescription>Exportez vos données et générez des rapports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex-col gap-2">
                      <Download className="h-6 w-6 text-primary" />
                      <div className="text-center">
                        <p className="font-semibold">Export Étudiants</p>
                        <p className="text-xs text-muted-foreground">Liste complète (Excel)</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2">
                      <Download className="h-6 w-6 text-accent" />
                      <div className="text-center">
                        <p className="font-semibold">Rapport Financier</p>
                        <p className="text-xs text-muted-foreground">Revenus et paiements (PDF)</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2">
                      <Download className="h-6 w-6 text-green-600" />
                      <div className="text-center">
                        <p className="font-semibold">Rapport Formations</p>
                        <p className="text-xs text-muted-foreground">Statistiques par formation (PDF)</p>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col gap-2"
                      onClick={async () => {
                        try {
                          const response = await fetch(apiUrl("/api/admin/reports/annual"));
                          if (response.ok) {
                            const data = await response.json();
                            toast.success("Rapport généré avec succès (Données récupérées)");
                            console.log("Données du rapport:", data);
                            // Ici on pourrait ouvrir une nouvelle fenêtre pour imprimer
                          } else {
                            toast.error("Erreur lors de la génération du rapport");
                          }
                        } catch (err) {
                          toast.error("Erreur de connexion");
                        }
                      }}
                    >
                      <Download className="h-6 w-6 text-purple-600" />
                      <div className="text-center">
                        <p className="font-semibold">Rapport Annuel</p>
                        <p className="text-xs text-muted-foreground">Bilan complet (PDF)</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques Détaillées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Taux de Présence Moyen</p>
                      <p className="text-3xl font-bold text-blue-600">92%</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Taux de Réussite</p>
                      <p className="text-3xl font-bold text-green-600">87%</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Moyenne Générale</p>
                      <p className="text-3xl font-bold text-accent">15.8/20</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Teacher Dialog */}
      <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {teacherDialogMode === "view" ? "Détails de l'enseignant" : "Modifier l'enseignant"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Nom</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={editTeacherName}
                onChange={(e) => setEditTeacherName(e.target.value)}
                disabled={teacherDialogMode === "view"}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={editTeacherEmail}
                onChange={(e) => setEditTeacherEmail(e.target.value)}
                disabled={teacherDialogMode === "view"}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Téléphone</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={editTeacherPhone}
                onChange={(e) => setEditTeacherPhone(e.target.value)}
                disabled={teacherDialogMode === "view"}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Spécialité</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={editTeacherSpecialite}
                onChange={(e) => setEditTeacherSpecialite(e.target.value)}
                disabled={teacherDialogMode === "view"}
                placeholder="Ex: Marketing, Design, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTeacherDialogOpen(false)}
            >
              {teacherDialogMode === "view" ? "Fermer" : "Annuler"}
            </Button>
            {teacherDialogMode === "edit" && (
              <Button
                type="submit"
                disabled={isSavingStudent}
                onClick={async (e) => {
                  e.preventDefault();
                  if (!activeTeacher) return;

                  try {
                    const response = await fetch(apiUrl(`/api/admin/teachers/${activeTeacher.id}`), {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify({
                        name: editTeacherName,
                        email: editTeacherEmail,
                        phone: editTeacherPhone,
                        specialite: editTeacherSpecialite,
                      }),
                    });

                    if (!response.ok) {
                      const err = await response.json().catch(() => ({}));
                      throw new Error(err?.message ?? "Erreur lors de la mise à jour");
                    }

                    const updated: TeacherRow = await response.json();
                    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                    setIsTeacherDialogOpen(false);
                    toast.success("Enseignant mis à jour.");
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Erreur.");
                  }
                }}
              >
                Enregistrer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Payment View Dialog */}
      <Dialog open={isViewPaymentDialogOpen} onOpenChange={setIsViewPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du paiement</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="font-medium">Étudiant:</p>
                <p>{selectedPayment.etudiant}</p>
                
                <p className="font-medium">Montant:</p>
                <p className="font-bold text-accent">
                  {typeof selectedPayment.montant === 'number' 
                    ? (selectedPayment.montant as number).toLocaleString('fr-FR') + ' FCFA'
                    : selectedPayment.montant}
                </p>
                
                <p className="font-medium">Formation / Type:</p>
                <p>{selectedPayment.type}</p>
                
                <p className="font-medium">Date:</p>
                <p>{selectedPayment.date}</p>
                
                <p className="font-medium">Statut:</p>
                <div className="flex flex-col gap-1">
                  <Badge className={selectedPayment.statut === "Payé" ? "bg-green-500 text-white w-fit" : "bg-yellow-500 text-white w-fit"}>
                    {selectedPayment.statut}
                  </Badge>
                  {selectedPayment.statut === "Payé" && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded w-fit ${selectedPayment.is_partial ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {selectedPayment.is_partial ? 'Tranche' : 'Paiement Complet'}
                    </span>
                  )}
                </div>

                {selectedPayment.formation_price && selectedPayment.formation_price > 0 && (
                  <>
                    <p className="font-medium mt-2">Récapitulatif financier:</p>
                    <div className="col-span-2 p-3 bg-muted rounded-md text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Prix formation:</span>
                        <span className="font-semibold">{selectedPayment.formation_price.toLocaleString("fr-FR")} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total déjà payé:</span>
                        <span className="font-semibold text-green-600">{selectedPayment.total_paid_so_far?.toLocaleString("fr-FR")} FCFA</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 mt-1">
                        <span>Reste à payer:</span>
                        <span className={`font-bold ${selectedPayment.remaining && selectedPayment.remaining > 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                          {selectedPayment.remaining?.toLocaleString("fr-FR")} FCFA
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewPaymentDialogOpen(false)}>
              Fermer
            </Button>
            {selectedPayment?.statut === "En attente" && (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleConfirmPayment(selectedPayment.id);
                  setIsViewPaymentDialogOpen(false);
                }}
              >
                Confirmer le paiement
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Formation Students Dialog */}
      <Dialog open={isFormationStudentsDialogOpen} onOpenChange={setIsFormationStudentsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Étudiants inscrits - {selectedFormationName}</DialogTitle>
            <DialogDescription>
              Liste des étudiants actuellement inscrits à cette formation.
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingFormationStudents ? (
            <div className="py-8 text-center text-muted-foreground">Chargement des étudiants...</div>
          ) : formationStudents.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Aucun étudiant inscrit à cette formation.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formationStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.matricule}</TableCell>
                    <TableCell>{student.joined_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormationStudentsDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
