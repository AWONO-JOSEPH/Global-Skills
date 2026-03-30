import { apiUrl } from "../../lib/api";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState, useCallback, useRef } from "react";
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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
  ClipboardList,
  BookOpen,
  Menu,
  X,
  Trash2,
  CheckCircle,
  Camera,
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

type StudentRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  formation_name?: string;
  matricule?: string;
};

type TeacherRow = {
  id: number;
  name: string;
  email: string;
  specialite?: string;
};

type FormationRow = {
  id: number;
  name: string;
  description?: string;
  duration?: string;
  price?: number;
  registration_fee?: number;
  category?: string;
  level?: string;
  certification?: string;
};

type PaymentRow = {
  id: number;
  student_name: string;
  amount: number;
  date: string;
  status?: string;
};

type ProgramTracking = {
  id: number;
  formation_name: string;
  subject: string;
  date: string;
  status?: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTabState] = useState(searchParams.get("tab") || localStorage.getItem("admin_tab") || "overview");

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
    localStorage.setItem("admin_tab", tab);
  };

  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentPoint[]>([]);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [formations, setFormations] = useState<FormationRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [trackings, setTrackings] = useState<ProgramTracking[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [isLoadingFormations, setIsLoadingFormations] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isLoadingTrackings, setIsLoadingTrackings] = useState(false);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const auth = getCurrentAuth();
      if (!auth) return;
      formData.append('email', auth.email);
      const response = await fetch(apiUrl("/api/profile/photo"), { method: 'POST', body: formData, credentials: "include" });
      if (response.ok) { 
        const data = await response.json(); 
        setStats((prev: any) => prev ? { ...prev, photo: data.photo } : null); 
        toast.success("Photo de profil mise à jour avec succès"); 
      }
      else toast.error("Erreur lors du téléchargement de la photo");
    } catch { toast.error("Erreur de connexion"); }
  };

  const loadOverview = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingOverview(true);
    try {
      const response = await fetch(apiUrl("/api/admin/overview"), {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Erreur");
      const data = await response.json();
      setStats(data.stats);
      setEnrollmentData(data.enrollmentData ?? []);
      setRevenueData(data.revenueData ?? []);
      setRecentStudents(data.recentStudents ?? []);
      setRecentPayments(data.recentPayments ?? []);
    } catch {} finally { if (!silent) setIsLoadingOverview(false); }
  }, []);

  const loadStudents = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingStudents(true);
    try {
      const r = await fetch(apiUrl("/api/admin/students"), { 
        credentials: "include",
        headers: { Accept: "application/json" } 
      });
      if (r.ok) setStudents(await r.json());
    } catch {} finally { if (!silent) setIsLoadingStudents(false); }
  }, []);

  const loadTeachers = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingTeachers(true);
    try {
      const r = await fetch(apiUrl("/api/admin/teachers"), { 
        credentials: "include",
        headers: { Accept: "application/json" } 
      });
      if (r.ok) setTeachers(await r.json());
    } catch {} finally { if (!silent) setIsLoadingTeachers(false); }
  }, []);

  const loadFormations = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingFormations(true);
    try {
      const r = await fetch(apiUrl("/api/admin/formations"), { 
        credentials: "include",
        headers: { Accept: "application/json" } 
      });
      if (r.ok) setFormations(await r.json());
    } catch {} finally { if (!silent) setIsLoadingFormations(false); }
  }, []);

  const loadPayments = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingPayments(true);
    try {
      const r = await fetch(apiUrl("/api/admin/payments"), { 
        credentials: "include",
        headers: { Accept: "application/json" } 
      });
      if (r.ok) setPayments(await r.json());
    } catch {} finally { if (!silent) setIsLoadingPayments(false); }
  }, []);

  const loadTrackings = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingTrackings(true);
    try {
      const r = await fetch(apiUrl("/api/program-trackings"), { 
        credentials: "include",
        headers: { Accept: "application/json" } 
      });
      if (r.ok) setTrackings(await r.json());
    } catch (err) { console.error(err); } finally { if (!silent) setIsLoadingTrackings(false); }
  }, []);

  const loadAllData = useCallback(async (silent = false) => {
    await Promise.all([
      loadOverview(silent),
      loadStudents(silent),
      loadTeachers(silent),
      loadFormations(silent),
      loadPayments(silent),
      loadTrackings(silent),
    ]);
  }, [loadOverview, loadStudents, loadTeachers, loadFormations, loadPayments, loadTrackings]);

  useEffect(() => {
    const auth = getCurrentAuth();
    if (!auth || auth.role !== "admin") {
      logout();
      navigate("/login");
      return;
    }

    // Load only data for the initial active tab
    if (activeTab === "overview") loadOverview();
    else if (activeTab === "students") loadStudents();
    else if (activeTab === "teachers") loadTeachers();
    else if (activeTab === "formations") loadFormations();
    else if (activeTab === "payments") loadPayments();
    else if (activeTab === "tracking") loadTrackings();

    const interval = setInterval(() => {
      // Background refresh only for current tab
      if (activeTab === "overview") loadOverview(true);
      else if (activeTab === "students") loadStudents(true);
      else if (activeTab === "teachers") loadTeachers(true);
      else if (activeTab === "formations") loadFormations(true);
      else if (activeTab === "payments") loadPayments(true);
      else if (activeTab === "tracking") loadTrackings(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate, activeTab, loadOverview, loadStudents, loadTeachers, loadFormations, loadPayments, loadTrackings]);

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) return;
    try {
      const response = await fetch(apiUrl(`/api/admin/students/${studentId}`), {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        toast.success("Étudiant supprimé.");
      } else throw new Error();
    } catch { toast.error("Erreur lors de la suppression."); }
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) return;
    try {
      const response = await fetch(apiUrl(`/api/admin/teachers/${teacherId}`), {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setTeachers(prev => prev.filter(t => t.id !== teacherId));
        toast.success("Enseignant supprimé.");
      } else throw new Error();
    } catch { toast.error("Erreur lors de la suppression."); }
  };

  const handleDeleteFormation = async (id: number) => {
    if (!confirm("Supprimer cette formation ?")) return;
    try {
      const response = await fetch(apiUrl(`/api/admin/formations/${id}`), {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setFormations(prev => prev.filter(f => f.id !== id));
        toast.success("Formation supprimée.");
      } else throw new Error();
    } catch { toast.error("Erreur lors de la suppression."); }
  };

  const handleConfirmPayment = async (paymentId: number) => {
    try {
      const response = await fetch(apiUrl(`/api/admin/payments/${paymentId}/confirm`), {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: "Payé" } : p));
        toast.success("Paiement confirmé.");
        loadOverview(true);
      } else throw new Error();
    } catch { toast.error("Erreur lors de la confirmation."); }
  };

  const handleGenerateReport = async (type: "annual" | "tracking") => {
    try {
      const response = await fetch(apiUrl(`/api/admin/reports/${type}`), {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.url) window.open(data.url, "_blank");
        else toast.info("Rapport généré avec succès.");
      } else throw new Error();
    } catch { toast.error("Erreur lors de la génération du rapport."); }
  };

  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [isFormationDialogOpen, setIsFormationDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student" as "student" | "teacher" | "admin",
    formation_id: "" as number | "",
    specialite: "",
    title: "",
    description: "",
    price: "",
    duration: "",
    registration_fee: "",
    category: "",
    level: "",
    certification: "",
    amount: "",
    student_id: "" as number | "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "", email: "", phone: "", role: "student",
      formation_id: "", specialite: "",
      title: "", description: "", price: "", duration: "",
      registration_fee: "", category: "", level: "", certification: "",
      amount: "", student_id: "",
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId 
        ? apiUrl(`/api/admin/${formData.role === 'student' ? 'students' : 'teachers'}/${editingId}`)
        : apiUrl("/api/admin/users");
      
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          formation_id: formData.role === "student" ? formData.formation_id : null,
          specialite: formData.role === "teacher" ? formData.specialite : null,
        }),
      });
      if (response.ok) {
        toast.success(editingId ? "Mis à jour avec succès." : "Utilisateur créé avec succès.");
        setIsStudentDialogOpen(false);
        setIsTeacherDialogOpen(false);
        resetForm();
        loadAllData(true);
      } else {
        const err = await response.json();
        toast.error(err.message || "Erreur lors de l'opération.");
      }
    } catch { toast.error("Erreur de connexion."); }
    finally { setIsSubmitting(false); }
  };

  const handleCreateFormation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? apiUrl(`/api/admin/formations/${editingId}`) : apiUrl("/api/admin/formations");
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.title,
          description: formData.description,
          price: formData.price,
          registration_fee: formData.registration_fee || 25000,
          duration: formData.duration,
          category: formData.category,
          level: formData.level,
          certification: formData.certification,
        }),
      });
      if (response.ok) {
        toast.success(editingId ? "Formation mise à jour." : "Formation créée.");
        setIsFormationDialogOpen(false);
        resetForm();
        loadFormations(true);
      } else throw new Error();
    } catch { toast.error("Erreur lors de l'opération."); }
    finally { setIsSubmitting(false); }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const student = students.find(s => s.id === formData.student_id);
      const response = await fetch(apiUrl("/api/admin/payments"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          user_id: formData.student_id,
          amount: formData.amount,
          formation_id: student?.formation_id,
        }),
      });
      if (response.ok) {
        toast.success("Paiement enregistré.");
        setIsPaymentDialogOpen(false);
        resetForm();
        loadPayments(true);
        loadOverview(true);
      } else {
        const err = await response.json();
        toast.error(err.message || "Erreur lors de l'enregistrement.");
      }
    } catch { toast.error("Erreur de connexion."); }
    finally { setIsSubmitting(false); }
  };

  const handleSignTracking = async (id: number) => {
    try {
      const auth = getCurrentAuth();
      if (!auth) return;
      const response = await fetch(apiUrl(`/api/program-trackings/${id}/sign?email=${encodeURIComponent(auth.email)}`), {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setTrackings(prev => prev.map(t => t.id === id ? { ...t, admin_signed_at: new Date().toISOString() } : t));
        toast.success("Fiche de suivi signée.");
      } else throw new Error();
    } catch { toast.error("Erreur lors de la signature."); }
  };

  const handleEditStudent = (student: StudentRow) => {
    setEditingId(student.id);
    setFormData({
      ...formData,
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      role: "student",
      formation_id: student.formation_id || "",
    });
    setIsStudentDialogOpen(true);
  };

  const handleEditTeacher = (teacher: TeacherRow) => {
    setEditingId(teacher.id);
    setFormData({
      ...formData,
      name: teacher.name,
      email: teacher.email,
      role: "teacher",
      specialite: teacher.specialite || "",
    });
    setIsTeacherDialogOpen(true);
  };

  const handleEditFormation = (formation: FormationRow) => {
    setEditingId(formation.id);
    setFormData({
      ...formData,
      title: formation.name,
      description: formation.description || "",
      price: formation.price?.toString() || "",
      duration: formation.duration || "",
    });
    setIsFormationDialogOpen(true);
  };

  const tabItems = [
    { value: "overview", label: "Aperçu", icon: BarChart3 },
    { value: "students", label: "Étudiants", icon: Users },
    { value: "teachers", label: "Enseignants", icon: GraduationCap },
    { value: "formations", label: "Formations", icon: BookOpen },
    { value: "payments", label: "Paiements", icon: DollarSign },
    { value: "tracking", label: "Suivi", icon: ClipboardList },
    { value: "reports", label: "Rapports", icon: FileText },
  ];

  const LoadingSpinner = ({ color = "border-primary" }: { color?: string }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className={`animate-spin rounded-full h-7 w-7 border-2 border-t-transparent ${color}`} />
      <p className="text-sm text-gray-400 font-medium">Chargement…</p>
    </div>
  );

  const EmptyState = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <div className="p-4 bg-gray-50 rounded-2xl mb-2">
        <Icon className="h-8 w-8 text-gray-300" />
      </div>
      <p className="text-gray-500 font-semibold">{title}</p>
      <p className="text-gray-400 text-sm text-center max-w-xs">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="bg-primary sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative flex-shrink-0 group">
              <img
                src={stats?.photo || `https://ui-avatars.com/api/?name=Admin&background=1e3a8a&color=fff`}
                alt="Admin"
                className="h-9 w-9 rounded-xl object-cover cursor-pointer border border-white/20 hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  const img = new Image();
                  img.src = stats?.photo || '';
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
                onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                className="absolute -bottom-1 -right-1 h-4 w-4 bg-white rounded-md shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
              >
                <Camera className="h-2 w-2" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-white font-bold text-sm tracking-wider">GLOBAL SKILLS</p>
              <p className="text-white/60 text-[10px] uppercase tracking-widest">Administration</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { to: "/admin/news", icon: Newspaper, label: "Actualités" },
              { to: "/admin/international-requests", icon: Globe, label: "International", badge: stats?.new_international_requests },
              { to: "/admin/contact-messages", icon: MessageSquare, label: "Messages", badge: stats?.new_messages },
              { to: "/settings", icon: Settings, label: "Paramètres" },
            ].map(({ to, icon: Icon, label, badge }) => (
              <Link to={to} key={to}>
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg h-9 px-3 text-sm font-medium relative transition-all">
                  <Icon className="h-4 w-4 mr-1.5" />
                  {label}
                  {badge ? (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  ) : null}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost" size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg h-9 px-3 text-sm font-medium ml-1"
              onClick={() => { logout(); navigate("/login"); }}
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Déconnexion
            </Button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-primary">
            <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-col gap-1">
              {[
                { to: "/admin/news", icon: Newspaper, label: "Actualités" },
                { to: "/admin/international-requests", icon: Globe, label: "International", badge: stats?.new_international_requests },
                { to: "/admin/contact-messages", icon: MessageSquare, label: "Messages", badge: stats?.new_messages },
                { to: "/settings", icon: Settings, label: "Paramètres" },
              ].map(({ to, icon: Icon, label, badge }) => (
                <Link to={to} key={to} onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all relative">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                    {badge ? (
                      <span className="ml-auto h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {badge > 9 ? "9+" : badge}
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all w-full"
                onClick={() => { logout(); navigate("/login"); }}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>

          {/* ── TAB NAV ── */}
          {/* Desktop: horizontal strip */}
          <div className="hidden sm:block mb-6">
            <TabsList className="bg-white border border-gray-100 shadow-sm rounded-2xl p-1.5 h-auto w-full flex gap-1 overflow-x-auto">
              {tabItems.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 transition-all duration-200
                    data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm
                    hover:text-gray-700 hover:bg-gray-50 flex-shrink-0"
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Mobile: current tab label + bottom sheet style scroll */}
          <div className="sm:hidden mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800">
                {tabItems.find(t => t.value === activeTab)?.label}
              </h2>
              <button
                className="flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/8 px-3 py-1.5 rounded-full"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                <Menu className="h-3.5 w-3.5" />
                Navigation
              </button>
            </div>
            {/* Scrollable tab chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {tabItems.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold flex-shrink-0 transition-all duration-200 border
                    ${activeTab === value
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              TAB: OVERVIEW
          ════════════════════════════════════════════════ */}
          <TabsContent value="overview" className="space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  label: "Étudiants", value: stats?.total_students?.toLocaleString() ?? "0",
                  sub: "inscrits", icon: Users, color: "text-primary", bg: "bg-primary/8",
                },
                {
                  label: "Formations", value: stats?.total_formations ?? "0",
                  sub: "disponibles", icon: BookOpen, color: "text-secondary", bg: "bg-secondary/8",
                },
                {
                  label: "Revenus", value: stats?.monthly_revenue ? `${(stats.monthly_revenue / 1000).toFixed(0)}k` : "0k",
                  sub: "FCFA ce mois", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50",
                },
                {
                  label: "Messages", value: stats?.new_messages ?? "0",
                  sub: "non lus", icon: MessageSquare, color: "text-accent", bg: "bg-accent/8",
                  badge: stats?.new_messages,
                },
              ].map(({ label, value, sub, icon: Icon, color, bg, badge }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all duration-200 relative overflow-hidden">
                  {/* Soft bg circle decoration */}
                  <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full ${bg} opacity-40`} />
                  <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3 relative`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  {badge ? (
                    <span className="absolute top-3 right-3 h-5 w-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  ) : null}
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none mb-1">{value}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-2 bg-primary/8 rounded-xl">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Évolution des inscriptions</h3>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={enrollmentData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: 12 }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="students" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Revenus mensuels</h3>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: 12 }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent students */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 bg-primary/8 rounded-xl">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Étudiants récents</h3>
                </div>
                <div className="space-y-2">
                  {recentStudents?.length ? recentStudents.slice(0, 4).map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-xs font-bold">{s.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.formation}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full">Nouveau</span>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center py-8 gap-2">
                      <Users className="h-8 w-8 text-gray-200" />
                      <p className="text-sm text-gray-400">Aucun étudiant récent</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent payments */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Paiements récents</h3>
                </div>
                <div className="space-y-2">
                  {recentPayments?.length ? recentPayments.slice(0, 4).map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{p.student_name}</p>
                          <p className="text-xs text-gray-400">{p.date}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        {p.amount} FCFA
                      </span>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center py-8 gap-2">
                      <DollarSign className="h-8 w-8 text-gray-200" />
                      <p className="text-sm text-gray-400">Aucun paiement récent</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════
              TAB: STUDENTS
          ════════════════════════════════════════════════ */}
          <TabsContent value="students">
            <div className="bg-white rounded-2xl border border-gray-100">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/8 rounded-xl">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Gestion des Étudiants</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Liste complète des étudiants inscrits</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsStudentDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl h-9 px-4 text-sm font-medium shadow-sm self-start sm:self-auto"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {/* Content */}
              <div className="p-5">
                {isLoadingStudents ? <LoadingSpinner /> :
                  students.length === 0 ? <EmptyState icon={Users} title="Aucun étudiant trouvé" subtitle="Commencez par ajouter votre premier étudiant" /> : (
                    <>
                      {/* Mobile cards */}
                      <div className="sm:hidden space-y-3">
                        {students.map((s) => (
                          <div key={s.id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-primary text-xs font-bold">{s.name?.[0]?.toUpperCase()}</span>
                                </div>
                                <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                              </div>
                              <Badge variant="secondary" className="bg-primary/8 text-primary border-0 text-[10px] font-semibold">
                                {s.formation_name || '-'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400 pl-10">{s.email}</p>
                              <div className="flex items-center justify-between pl-10">
                              <p className="text-xs text-gray-400">{s.phone || '-'}</p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg border-gray-100 hover:border-primary/30 hover:bg-primary/5" onClick={() => handleEditStudent(s)}>
                                  Modifier
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg border-red-100 text-red-600 hover:bg-red-50" onClick={() => handleDeleteStudent(s.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-50 hover:bg-transparent">
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Nom</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Téléphone</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Formation</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students.map((s) => (
                              <TableRow key={s.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium text-gray-900 text-sm">{s.name}</TableCell>
                                <TableCell className="text-gray-500 text-sm">{s.email}</TableCell>
                                <TableCell className="text-gray-500 text-sm hidden md:table-cell">{s.phone || '—'}</TableCell>
                                <TableCell>
                                  <span className="text-[11px] font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full">
                                    {s.formation_name || '—'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-gray-100 hover:border-primary/30 hover:bg-primary/5" onClick={() => handleEditStudent(s)}>
                                      Modifier
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-red-100 text-red-600 hover:bg-red-50" onClick={() => handleDeleteStudent(s.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
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

          {/* ════════════════════════════════════════════════
              TAB: TEACHERS
          ════════════════════════════════════════════════ */}
          <TabsContent value="teachers">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-secondary/8 rounded-xl">
                    <GraduationCap className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Gestion des Enseignants</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Liste complète des enseignants actifs</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsTeacherDialogOpen(true)}
                  className="bg-secondary hover:bg-secondary/90 text-white rounded-xl h-9 px-4 text-sm font-medium shadow-sm self-start sm:self-auto"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <div className="p-5">
                {isLoadingTeachers ? <LoadingSpinner color="border-secondary" /> :
                  teachers.length === 0 ? <EmptyState icon={GraduationCap} title="Aucun enseignant trouvé" subtitle="Commencez par ajouter votre premier enseignant" /> : (
                    <>
                      {/* Mobile cards */}
                      <div className="sm:hidden space-y-3">
                        {teachers.map((t) => (
                          <div key={t.id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                                  <span className="text-secondary text-xs font-bold">{t.name?.[0]?.toUpperCase()}</span>
                                </div>
                                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                              </div>
                              {t.specialite && (
                                <span className="text-[10px] font-semibold text-secondary bg-secondary/8 px-2.5 py-1 rounded-full">{t.specialite}</span>
                              )}
                            </div>
                            <div className="flex items-center justify-between pl-10">
                              <p className="text-xs text-gray-400">{t.email}</p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg border-gray-100 hover:border-secondary/30 hover:bg-secondary/5" onClick={() => handleEditTeacher(t)}>
                                  Modifier
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg border-red-100 text-red-600 hover:bg-red-50" onClick={() => handleDeleteTeacher(t.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-50 hover:bg-transparent">
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Nom</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Spécialité</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teachers.map((t) => (
                              <TableRow key={t.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium text-gray-900 text-sm">{t.name}</TableCell>
                                <TableCell className="text-gray-500 text-sm">{t.email}</TableCell>
                                <TableCell className="text-gray-500 text-sm hidden lg:table-cell">{t.specialite || '—'}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-gray-100 hover:border-secondary/30 hover:bg-secondary/5" onClick={() => handleEditTeacher(t)}>
                                      Modifier
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-red-100 text-red-600 hover:bg-red-50" onClick={() => handleDeleteTeacher(t.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
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

          {/* ════════════════════════════════════════════════
              TAB: FORMATIONS
          ════════════════════════════════════════════════ */}
          <TabsContent value="formations">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-secondary/8 rounded-xl">
                    <BookOpen className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Gestion des Formations</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Liste complète des formations disponibles</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsFormationDialogOpen(true)}
                  className="bg-secondary hover:bg-secondary/90 text-white rounded-xl h-9 px-4 text-sm font-medium shadow-sm self-start sm:self-auto"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <div className="p-5">
                {isLoadingFormations ? <LoadingSpinner color="border-secondary" /> :
                  formations.length === 0 ? <EmptyState icon={BookOpen} title="Aucune formation trouvée" subtitle="Commencez par ajouter votre première formation" /> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formations.map((f) => (
                        <div key={f.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm leading-snug">{f.name}</h4>
                              {f.category && (
                                <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-full inline-block mt-1">
                                  {f.category}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-secondary bg-secondary/8 px-2 py-1 rounded-full flex-shrink-0">{f.duration || 'N/A'}</span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 flex-1">{f.description || 'Aucune description'}</p>
                          
                          {/* Tarifs détaillés */}
                          <div className="space-y-2 pt-1 border-t border-gray-50">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Coût formation:</span>
                              <span className="text-sm font-bold text-gray-900">
                                {f.price ? f.price.toLocaleString() + ' FCFA' : '—'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Frais inscription:</span>
                              <span className="text-sm font-semibold text-orange-600">
                                {f.registration_fee ? f.registration_fee.toLocaleString() + ' FCFA' : '25 000 FCFA'}
                              </span>
                            </div>
                            {f.level && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Niveau:</span>
                                <span className="text-xs font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded">{f.level}</span>
                              </div>
                            )}
                            {f.certification && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Certification:</span>
                                <span className="text-xs font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded">{f.certification}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 mt-auto pt-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg border-gray-100 hover:border-secondary/30 hover:bg-secondary/5 flex-1" onClick={() => handleEditFormation(f)}>
                              Modifier
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg border-red-100 text-red-600 hover:bg-red-50" onClick={() => handleDeleteFormation(f.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════
              TAB: PAYMENTS
          ════════════════════════════════════════════════ */}
          <TabsContent value="payments">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 rounded-xl">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Gestion des Paiements</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Historique complet des paiements</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsPaymentDialogOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-4 text-sm font-medium shadow-sm self-start sm:self-auto"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Nouveau paiement
                </Button>
              </div>

              <div className="p-5">
                {isLoadingPayments ? <LoadingSpinner color="border-emerald-600" /> :
                  payments.length === 0 ? <EmptyState icon={DollarSign} title="Aucun paiement trouvé" subtitle="Les paiements apparaîtront ici" /> : (
                    <>
                      {/* Mobile cards */}
                      <div className="sm:hidden space-y-3">
                        {payments.map((p) => (
                          <div key={p.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{p.student_name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{p.date}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                {p.amount?.toLocaleString()} FCFA
                              </span>
                              {p.status === "Payé" ? (
                                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Payé</span>
                              ) : (
                                <Button size="sm" className="h-6 text-[10px] bg-amber-500 hover:bg-amber-600 text-white gap-1" onClick={() => handleConfirmPayment(p.id)}>
                                  <CheckCircle className="h-3 w-3" />
                                  Confirmer
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-50 hover:bg-transparent">
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Étudiant</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Montant</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {payments.map((p) => (
                              <TableRow key={p.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium text-gray-900 text-sm">{p.student_name}</TableCell>
                                <TableCell>
                                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                    {p.amount?.toLocaleString()} FCFA
                                  </span>
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm">{p.date}</TableCell>
                                <TableCell className="text-right">
                                  {p.status === "Payé" ? (
                                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Payé</span>
                                  ) : (
                                    <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white gap-1.5" onClick={() => handleConfirmPayment(p.id)}>
                                      <CheckCircle className="h-3.5 w-3.5" />
                                      Confirmer
                                    </Button>
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

          {/* ════════════════════════════════════════════════
              TAB: TRACKING
          ════════════════════════════════════════════════ */}
          <TabsContent value="tracking">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 p-5 border-b border-gray-50">
                <div className="p-2.5 bg-accent/8 rounded-xl">
                  <ClipboardList className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Suivi des Programmes</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Rapports de progression des formations</p>
                </div>
              </div>

              <div className="p-5">
                {isLoadingTrackings ? <LoadingSpinner color="border-accent" /> :
                  trackings.length === 0 ? <EmptyState icon={ClipboardList} title="Aucun suivi trouvé" subtitle="Les rapports de suivi apparaîtront ici" /> : (
                    <>
                      {/* Mobile cards */}
                      <div className="sm:hidden space-y-3">
                        {trackings.map((t) => (
                          <div key={t.id} className="border border-gray-100 rounded-xl p-4 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-gray-900 text-sm">{t.formation_name}</p>
                              <span className="text-[10px] font-semibold text-accent bg-accent/8 px-2.5 py-1 rounded-full">{t.status || 'Complété'}</span>
                            </div>
                            <p className="text-xs text-gray-500">{t.subject}</p>
                            <p className="text-xs text-gray-400">{t.date}</p>
                          </div>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-50 hover:bg-transparent">
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Formation</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Matière</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date</TableHead>
                              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">Statut</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {trackings.map((t) => (
                              <TableRow key={t.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium text-gray-900 text-sm">{t.formation?.name}</TableCell>
                                <TableCell className="text-gray-500 text-sm hidden md:table-cell">{t.subject}</TableCell>
                                <TableCell className="text-gray-500 text-sm">{new Date(t.date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  {t.admin_signed_at ? (
                                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1 justify-end">
                                      <CheckCircle className="h-3 w-3" /> Signé
                                    </span>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="h-7 text-[10px] border-amber-200 text-amber-700 hover:bg-amber-50"
                                      onClick={() => handleSignTracking(t.id)}
                                    >
                                      Signer
                                    </Button>
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

          {/* ════════════════════════════════════════════════
              TAB: REPORTS
          ════════════════════════════════════════════════ */}
          <TabsContent value="reports">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-destructive/8 rounded-xl">
                    <FileText className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Rapports et Analytics</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Rapports détaillés et statistiques</p>
                  </div>
                </div>
                <Button className="bg-destructive hover:bg-destructive/90 text-white rounded-xl h-9 px-4 text-sm font-medium shadow-sm self-start sm:self-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Rapport mensuel", desc: "Statistiques détaillées du mois en cours", type: "tracking" },
                    { title: "Rapport annuel", desc: "Analyse complète de l'année", type: "annual" },
                  ].map(({ title, desc, type }) => (
                    <div key={title} className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 bg-destructive/8 rounded-lg">
                          <FileText className="h-4 w-4 text-destructive" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                      </div>
                      <p className="text-xs text-gray-400 mb-4">{desc}</p>
                      <Button 
                        variant="outline" 
                        className="w-full h-9 text-sm rounded-xl border-gray-100 hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive transition-all"
                        onClick={() => handleGenerateReport(type as "annual" | "tracking")}
                      >
                        Générer le rapport
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* ── DIALOGS ─────────────────────────────────────────── */}
      <Dialog open={isStudentDialogOpen} onOpenChange={(open) => { setIsStudentDialogOpen(open); if(!open) resetForm(); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{editingId ? "Modifier l'étudiant" : "Ajouter un étudiant"}</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              {editingId ? "Mettre à jour les informations de l'étudiant" : "Créer un nouveau compte étudiant"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, role: 'student'})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Formation</Label>
              <Select value={formData.formation_id.toString()} onValueChange={v => setFormData({...formData, formation_id: parseInt(v)})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map(f => (
                    <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary">
                {isSubmitting ? "Opération..." : (editingId ? "Mettre à jour" : "Créer l'étudiant")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isTeacherDialogOpen} onOpenChange={(open) => { setIsTeacherDialogOpen(open); if(!open) resetForm(); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{editingId ? "Modifier l'enseignant" : "Ajouter un enseignant"}</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              {editingId ? "Mettre à jour les informations de l'enseignant" : "Créer un nouveau compte enseignant"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="t-name">Nom complet</Label>
              <Input id="t-name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, role: 'teacher'})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-email">Email</Label>
              <Input id="t-email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-specialite">Spécialité</Label>
              <Input id="t-specialite" value={formData.specialite} onChange={e => setFormData({...formData, specialite: e.target.value})} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-secondary">
                {isSubmitting ? "Opération..." : (editingId ? "Mettre à jour" : "Créer l'enseignant")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isFormationDialogOpen} onOpenChange={(open) => { setIsFormationDialogOpen(open); if(!open) resetForm(); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{editingId ? "Modifier la formation" : "Ajouter une formation"}</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              {editingId ? "Mettre à jour les détails de la formation" : "Créer une nouvelle formation"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateFormation} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="f-title">Titre de la formation</Label>
              <Input id="f-title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-desc">Description</Label>
              <Textarea id="f-desc" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-category">Catégorie</Label>
              <Select value={formData.category || ""} onValueChange={v => setFormData({...formData, category: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formations générales">Formations générales</SelectItem>
                  <SelectItem value="Formations fortement liées à l'informatique">Formations fortement liées à l'informatique</SelectItem>
                  <SelectItem value="Formations purement informatiques">Formations purement informatiques</SelectItem>
                  <SelectItem value="Formations en langues">Formations en langues</SelectItem>
                  <SelectItem value="Auto-école">Auto-école</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="f-price">Prix (FCFA)</Label>
                <Input id="f-price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-registration">Frais d'inscription (FCFA)</Label>
                <Input id="f-registration" type="number" value={formData.registration_fee || "25000"} onChange={e => setFormData({...formData, registration_fee: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="f-dur">Durée</Label>
                <Input id="f-dur" placeholder="ex: 12 mois" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-level">Niveau</Label>
                <Select value={formData.level || ""} onValueChange={v => setFormData({...formData, level: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 (débutant)</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="B1">B1</SelectItem>
                    <SelectItem value="B2">B2</SelectItem>
                    <SelectItem value="C1">C1</SelectItem>
                    <SelectItem value="C2">C2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-certification">Certification</Label>
              <Select value={formData.certification || ""} onValueChange={v => setFormData({...formData, certification: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DQP">DQP (Diplôme de Qualification Professionnelle)</SelectItem>
                  <SelectItem value="CQP">CQP (Certificat de Qualification Professionnelle)</SelectItem>
                  <SelectItem value="GOETHE">GOETHE</SelectItem>
                  <SelectItem value="ECL">ECL</SelectItem>
                  <SelectItem value="ÖSD">ÖSD</SelectItem>
                  <SelectItem value="IELTS">IELTS</SelectItem>
                  <SelectItem value="TOEFL">TOEFL</SelectItem>
                  <SelectItem value="TOEIC">TOEIC</SelectItem>
                  <SelectItem value="CIMA">CIMA</SelectItem>
                  <SelectItem value="DELE">DELE</SelectItem>
                  <SelectItem value="TCF">TCF</SelectItem>
                  <SelectItem value="TEF">TEF</SelectItem>
                  <SelectItem value="DALF">DALF</SelectItem>
                  <SelectItem value="DELF">DELF</SelectItem>
                  <SelectItem value="CILS">CILS</SelectItem>
                  <SelectItem value="CELI">CELI</SelectItem>
                  <SelectItem value="TORFL">TORFL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-secondary">
                {isSubmitting ? "Opération..." : (editingId ? "Mettre à jour" : "Créer la formation")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog Button logic needed in overview or payments tab */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={(open) => { setIsPaymentDialogOpen(open); if(!open) resetForm(); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Enregistrer un paiement</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">Saisir un nouveau paiement reçu</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePayment} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Étudiant</Label>
              <Select value={formData.student_id.toString()} onValueChange={v => setFormData({...formData, student_id: parseInt(v)})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'étudiant" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name} ({s.formation_name})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-amount">Montant (FCFA)</Label>
              <Input id="p-amount" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600">{isSubmitting ? "Enregistrement..." : "Enregistrer le paiement"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}