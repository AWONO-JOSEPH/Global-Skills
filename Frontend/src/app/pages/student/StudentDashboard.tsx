import { apiUrl } from "../../lib/api";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { toast } from "sonner";
import {
  GraduationCap, DollarSign, Calendar, FileText, Download,
  Bell, BookOpen, Award, LogOut, User, CheckCircle, Clock, Settings, Menu, X, Camera,
} from "lucide-react";
import logo from "../../../assets/84498a56cb9356abc2f9404869c93b519e727718.png";
import { getCurrentAuth, logout } from "../../auth";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || localStorage.getItem("student_tab") || "overview";
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
    localStorage.setItem("student_tab", tab);
  };

  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [formations, setFormations] = useState<any[]>([]);
  const [paiements, setPaiements] = useState<any[]>([]);
  const [calendrier, setCalendrier] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setStudentInfo((prev: any) => prev ? { ...prev, photo: data.photo } : null); 
        toast.success("Photo de profil mise à jour avec succès"); 
      }
      else toast.error("Erreur lors du téléchargement de la photo");
    } catch { toast.error("Erreur de connexion"); }
  };

  const loadStudentData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const auth = getCurrentAuth();
      if (!auth) return;
      const baseUrl = apiUrl("/api/student");
      const emailParam = `?email=${encodeURIComponent(auth.email)}`;
      
      // Define all endpoints
      const endpoints = {
        profile: `${baseUrl}/profile${emailParam}`,
        formations: `${baseUrl}/formations${emailParam}`,
        paiements: `${baseUrl}/paiements${emailParam}`,
        calendrier: `${baseUrl}/calendrier${emailParam}`,
        documents: `${baseUrl}/documents${emailParam}`,
        notifications: `${baseUrl}/notifications${emailParam}`,
        notes: `${baseUrl}/notes${emailParam}`,
        overview: `${baseUrl}/overview${emailParam}`,
      };

      // Load essential data (profile) always, and others based on active tab
      const profileRes = await fetch(endpoints.profile, { credentials: "include" });
      if (profileRes.ok) setStudentInfo(await profileRes.json());

      // Load specific tab data
      if (activeTab === "overview") {
        const res = await fetch(endpoints.overview, { credentials: "include" });
        if (res.ok) setOverview(await res.json());
      } else if (activeTab === "formations") {
        const res = await fetch(endpoints.formations, { credentials: "include" });
        if (res.ok) setFormations(await res.json());
      } else if (activeTab === "paiements") {
        const res = await fetch(endpoints.paiements, { credentials: "include" });
        if (res.ok) setPaiements(await res.json());
      } else if (activeTab === "calendrier") {
        const res = await fetch(endpoints.calendrier, { credentials: "include" });
        if (res.ok) setCalendrier(await res.json());
      } else if (activeTab === "documents") {
        const res = await fetch(endpoints.documents, { credentials: "include" });
        if (res.ok) setDocuments(await res.json());
      } else if (activeTab === "notifications") {
        const res = await fetch(endpoints.notifications, { credentials: "include" });
        if (res.ok) setNotifications(await res.json());
      }
      
      // Always load notes for stats if in overview
      if (activeTab === "overview") {
        const res = await fetch(endpoints.notes, { credentials: "include" });
        if (res.ok) setNotes(await res.json());
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      if (!silent) toast.error('Erreur lors du chargement des données');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const auth = getCurrentAuth();
    if (!auth || auth.role !== "student") { logout(); navigate("/login"); return; }
    loadStudentData();
    const interval = setInterval(() => loadStudentData(true), 30000);
    return () => clearInterval(interval);
  }, [navigate, loadStudentData, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-primary" />
          <p className="text-sm text-gray-400 font-medium">Chargement de vos données…</p>
        </div>
      </div>
    );
  }

  const tabItems = [
    { value: "overview",      label: "Aperçu",        icon: GraduationCap },
    { value: "formations",    label: "Formations",    icon: BookOpen },
    { value: "paiements",     label: "Paiements",     icon: DollarSign },
    { value: "calendrier",    label: "Calendrier",    icon: Calendar },
    { value: "documents",     label: "Documents",     icon: FileText },
    { value: "notifications", label: "Notifications", icon: Bell },
  ];

  const unreadCount = notifications.filter((n: any) => !n.lu).length;

  const EmptyState = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <div className="p-4 bg-gray-50 rounded-2xl mb-2"><Icon className="h-8 w-8 text-gray-300" /></div>
      <p className="text-gray-500 font-semibold">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* HEADER */}
      <header className="bg-primary sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={logo} alt="Global Skills" className="h-8 w-auto brightness-0 invert" />
            <div className="hidden sm:block leading-tight">
              <p className="text-white font-bold text-sm tracking-wider">GLOBAL SKILLS</p>
              <p className="text-white/60 text-[10px] uppercase tracking-widest">Espace Étudiant</p>
            </div>
            <p className="sm:hidden text-white font-bold text-sm tracking-widest">ÉTUDIANT</p>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg h-9 w-9 p-0 relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
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

          <div className="sm:hidden flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg h-9 w-9 p-0 relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
            <button className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
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
                src={studentInfo?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentInfo?.nom || 'Student')}&background=1e3a8a&color=fff`}
                alt={studentInfo?.nom}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  const img = new Image();
                  img.src = studentInfo?.photo || '';
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
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{studentInfo?.nom}</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Matricule : {studentInfo?.matricule}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-primary px-3 py-1 rounded-full">
                  <GraduationCap className="h-3 w-3" />{studentInfo?.formation}
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Phase : {studentInfo?.niveau}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm"
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
                    data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm
                    hover:text-gray-700 hover:bg-gray-50 relative">
                  <Icon className="h-4 w-4" /><span>{label}</span>
                  {value === "notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold flex-shrink-0 transition-all duration-200 border relative
                    ${activeTab === value ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-gray-500 border-gray-100"}`}>
                  <Icon className="h-3.5 w-3.5" />{label}
                  {value === "notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* TAB: OVERVIEW */}
          <TabsContent value="overview" className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-primary/8 rounded-xl"><GraduationCap className="h-4 w-4 text-primary" /></div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Progression</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{overview?.progression || 0}%</p>
                <Progress value={overview?.progression || 0} className="h-1.5 mb-1.5" />
                <p className="text-xs text-gray-400">Formation en cours</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-emerald-50 rounded-xl"><DollarSign className="h-4 w-4 text-emerald-600" /></div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Paiements</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {overview?.paiements_effectues || 0}<span className="text-lg text-gray-400">/{overview?.total_paiements || 0}</span>
                </p>
                <p className="text-xs text-gray-400">{(overview?.total_paiements - overview?.paiements_effectues) || 0} en attente</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-accent/8 rounded-xl"><Award className="h-4 w-4 text-accent" /></div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Moyenne</p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {overview?.moyenne_generale || 0}<span className="text-lg text-gray-400">/20</span>
                </p>
                <p className="text-xs text-gray-400">Très bien</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 bg-secondary/8 rounded-xl"><Calendar className="h-4 w-4 text-secondary" /></div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Prochain cours</p>
                </div>
                <p className="text-base font-bold text-gray-900 leading-snug mb-1">{overview?.prochain_cours?.cours || '—'}</p>
                <p className="text-xs text-gray-500">{overview?.prochain_cours?.date}</p>
                <p className="text-xs text-gray-400">{overview?.prochain_cours?.heure}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 bg-accent/8 rounded-xl"><Award className="h-4 w-4 text-accent" /></div>
                  <h3 className="font-bold text-gray-900 text-sm">Dernières Notes</h3>
                </div>
                <div className="space-y-1">
                  {notes.length === 0 ? <EmptyState icon={Award} title="Aucune note disponible" /> :
                    notes.map((note: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{note.matiere}</p>
                          <p className="text-xs text-gray-400">{note.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary leading-none">{note.note}</p>
                          <p className="text-xs text-gray-400">/{note.max}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 bg-secondary/8 rounded-xl"><Calendar className="h-4 w-4 text-secondary" /></div>
                  <h3 className="font-bold text-gray-900 text-sm">Prochains Cours</h3>
                </div>
                <div className="space-y-3">
                  {calendrier.length === 0 ? <EmptyState icon={Calendar} title="Aucun cours planifié" /> :
                    calendrier.slice(0, 3).map((cours: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{cours.cours}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{cours.date} · {cours.heure}</p>
                          <p className="text-xs text-gray-400">Salle {cours.salle}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB: FORMATIONS */}
          <TabsContent value="formations">
            <div className="space-y-4">
              {formations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-16 gap-2">
                  <EmptyState icon={BookOpen} title="Aucune formation" />
                </div>
              ) : formations.map((formation: any, index: number) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{formation.nom}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{formation.statut}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${formation.remaining > 0 ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>
                          {formation.payment_status}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">Début : {formation.debut}</span>
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">Fin : {formation.fin}</span>
                      </div>
                    </div>
                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end gap-2">
                      <p className="text-4xl font-bold text-primary leading-none">{formation.progression}%</p>
                      <p className="text-xs text-gray-400">Progression</p>
                    </div>
                  </div>
                  <Progress value={formation.progression} className="h-2 mb-5" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Tronc Commun", icon: CheckCircle, color: "text-emerald-500", status: "Terminé",  done: true  },
                      { label: "Spécialité",   icon: Clock,        color: "text-accent",      status: "En cours", done: false },
                      { label: "Stage",        icon: Clock,        color: "text-gray-300",    status: "À venir",  done: false },
                      { label: "Examen",       icon: Clock,        color: "text-gray-300",    status: "À venir",  done: false },
                    ].map(({ label, icon: Icon, color, status, done }) => (
                      <div key={label} className={`rounded-xl p-3 border ${done ? 'bg-emerald-50/50 border-emerald-100' : 'bg-gray-50/50 border-gray-100'}`}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{label}</p>
                        <div className="flex items-center gap-1.5">
                          <Icon className={`h-4 w-4 ${color} flex-shrink-0`} />
                          <span className={`text-xs font-semibold ${done ? 'text-emerald-700' : 'text-gray-500'}`}>{status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB: PAIEMENTS */}
          <TabsContent value="paiements">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 p-5 border-b border-gray-50">
                <div className="p-2.5 bg-emerald-50 rounded-xl"><DollarSign className="h-5 w-5 text-emerald-600" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Historique des Paiements</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Suivez l'état de vos paiements</p>
                </div>
              </div>
              <div className="p-5">
                <div className="sm:hidden space-y-3 mb-5">
                  {paiements.map((p: any, i: number) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.type}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <p className="font-bold text-gray-800 text-sm">{p.montant}</p>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${p.statut === "Payé" ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                          {p.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block overflow-x-auto mb-5">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-50 hover:bg-transparent">
                        {["Date", "Type", "Montant", "Statut"].map(h => (
                          <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paiements.map((p: any, i: number) => (
                        <TableRow key={i} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <TableCell className="text-gray-600 text-sm">{p.date}</TableCell>
                          <TableCell className="text-gray-600 text-sm">{p.type}</TableCell>
                          <TableCell className="font-bold text-gray-900 text-sm">{p.montant}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full w-fit border ${p.statut === "Payé" ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                {p.statut}
                              </span>
                              {p.statut === "Payé" && (
                                <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full w-fit">Tranche</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {paiements.some((p: any) => p.statut === "En attente") && (
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-0.5">⚠️ Paiement en attente</p>
                      <p className="text-xs text-yellow-700">Vous avez un paiement en attente. Veuillez régulariser votre situation.</p>
                    </div>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-white rounded-xl h-9 px-4 text-sm flex-shrink-0">
                      Effectuer un Paiement
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB: CALENDRIER */}
          <TabsContent value="calendrier">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 p-5 border-b border-gray-50">
                <div className="p-2.5 bg-secondary/8 rounded-xl"><Calendar className="h-5 w-5 text-secondary" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Calendrier des Cours</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Consultez votre emploi du temps</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                {calendrier.length === 0 ? <EmptyState icon={Calendar} title="Aucun cours planifié" /> :
                  calendrier.map((cours: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-200 transition-all duration-200">
                      <div className="h-14 w-14 rounded-xl bg-primary/8 flex flex-col items-center justify-center flex-shrink-0 border border-primary/10">
                        <p className="text-[10px] font-semibold text-primary/70 uppercase">{cours.date.split('/')[2]}</p>
                        <p className="text-xl font-bold text-primary leading-none">{cours.date.split('/')[1]}</p>
                        <p className="text-[10px] font-semibold text-primary/70">{cours.date.split('/')[0]}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{cours.cours}</h4>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="h-3.5 w-3.5" />{cours.heure}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-400"><BookOpen className="h-3.5 w-3.5" />Salle {cours.salle}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0 h-8 text-xs rounded-lg border-gray-100 hover:border-secondary/30 hover:bg-secondary/5">Détails</Button>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB: DOCUMENTS */}
          <TabsContent value="documents">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 p-5 border-b border-gray-50">
                <div className="p-2.5 bg-red-50 rounded-xl"><FileText className="h-5 w-5 text-red-600" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Mes Documents</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Téléchargez vos documents et attestations</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                {documents.length === 0 ? <EmptyState icon={FileText} title="Aucun document disponible" /> :
                  documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-200 transition-all duration-200">
                      <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{doc.nom}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{doc.type} · {doc.date}</p>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0 h-8 text-xs rounded-lg border-gray-100 hover:border-red-200 hover:bg-red-50">
                        <Download className="h-3.5 w-3.5 sm:mr-1.5" />
                        <span className="hidden sm:inline">Télécharger</span>
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB: NOTIFICATIONS */}
          <TabsContent value="notifications">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-accent/8 rounded-xl relative">
                    <Bell className="h-5 w-5 text-accent" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Restez informé des dernières actualités</p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <span className="text-xs font-semibold text-accent bg-accent/8 px-3 py-1.5 rounded-full">
                    {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="p-5 space-y-3">
                {notifications.length === 0 ? <EmptyState icon={Bell} title="Aucune notification" /> :
                  notifications.map((notif: any, index: number) => (
                    <div key={index}
                      className={`p-4 rounded-xl border transition-all ${!notif.lu ? 'bg-blue-50/60 border-blue-100' : 'bg-white border-gray-100'}`}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-semibold text-gray-900 text-sm">{notif.titre}</h4>
                        {!notif.lu && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full flex-shrink-0">Nouveau</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{notif.message}</p>
                      <p className="text-xs text-gray-400">{notif.date}</p>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}