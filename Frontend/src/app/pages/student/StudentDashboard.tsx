import { apiUrl } from "../../lib/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { toast } from "sonner";
import {
  GraduationCap,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Bell,
  BookOpen,
  Award,
  LogOut,
  User,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react";
import logo from "../../../assets/84498a56cb9356abc2f9404869c93b519e727718.png";
import { getCurrentAuth, logout } from "../../auth";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // États pour les données dynamiques
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [formations, setFormations] = useState<any[]>([]);
  const [paiements, setPaiements] = useState<any[]>([]);
  const [calendrier, setCalendrier] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    const auth = getCurrentAuth();
    if (!auth || auth.role !== "student") {
      logout();
      navigate("/login");
      return;
    }
    loadStudentData();
  }, [navigate]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const auth = getCurrentAuth();
      if (!auth) return;

      const baseUrl = apiUrl("/api/student");
      const emailParam = `?email=${encodeURIComponent(auth.email)}`;
      
      // Charger toutes les données en parallèle
      const [
        profileRes,
        formationsRes,
        paiementsRes,
        calendrierRes,
        documentsRes,
        notificationsRes,
        notesRes,
        overviewRes
      ] = await Promise.all([
        fetch(`${baseUrl}/profile${emailParam}`),
        fetch(`${baseUrl}/formations${emailParam}`),
        fetch(`${baseUrl}/paiements${emailParam}`),
        fetch(`${baseUrl}/calendrier${emailParam}`),
        fetch(`${baseUrl}/documents${emailParam}`),
        fetch(`${baseUrl}/notifications${emailParam}`),
        fetch(`${baseUrl}/notes${emailParam}`),
        fetch(`${baseUrl}/overview${emailParam}`)
      ]);

      if (profileRes.ok) setStudentInfo(await profileRes.json());
      if (formationsRes.ok) setFormations(await formationsRes.json());
      if (paiementsRes.ok) setPaiements(await paiementsRes.json());
      if (calendrierRes.ok) setCalendrier(await calendrierRes.json());
      if (documentsRes.ok) setDocuments(await documentsRes.json());
      if (notificationsRes.ok) setNotifications(await notificationsRes.json());
      if (notesRes.ok) setNotes(await notesRes.json());
      if (overviewRes.ok) setOverview(await overviewRes.json());
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Global Skills Logo" className="h-10 w-auto brightness-0 invert" />
              <div>
                <h1 className="text-lg font-bold">GLOBAL SKILLS</h1>
                <p className="text-xs text-white/80">Espace Étudiant</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>
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
        {/* Student Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <img
                src={studentInfo?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentInfo?.nom || 'Student')}&background=1e3a8a&color=fff`}
                alt={studentInfo?.nom}
                className="h-24 w-24 rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{studentInfo?.nom}</h2>
                <p className="text-muted-foreground mb-2">Matricule: {studentInfo?.matricule}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary text-white">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {studentInfo?.formation}
                  </Badge>
                  <Badge variant="secondary">
                    Phase: {studentInfo?.niveau}
                  </Badge>
                </div>
              </div>
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                Mon Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="formations">Mes Formations</TabsTrigger>
            <TabsTrigger value="paiements">Paiements</TabsTrigger>
            <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{overview?.progression || 0}%</div>
                  <Progress value={overview?.progression || 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Formation en cours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Paiements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">{overview?.paiements_effectues || 0}/{overview?.total_paiements || 0}</div>
                  <p className="text-sm">Effectués</p>
                  <p className="text-xs text-muted-foreground mt-2">{(overview?.total_paiements - overview?.paiements_effectues) || 0} paiement en attente</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Moyenne Générale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent mb-2">{overview?.moyenne_generale || 0}/20</div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-accent" />
                    <p className="text-xs text-muted-foreground">Très bien</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Prochain Cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold mb-1">{overview?.prochain_cours?.date}</div>
                  <p className="text-sm">{overview?.prochain_cours?.cours}</p>
                  <p className="text-xs text-muted-foreground mt-2">{overview?.prochain_cours?.heure}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Grades */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" />
                    Dernières Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notes.map((note, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{note.matiere}</p>
                          <p className="text-xs text-muted-foreground">{note.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{note.note}/{note.max}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Classes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    Prochains Cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {calendrier.slice(0, 3).map((cours, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{cours.cours}</p>
                          <p className="text-sm text-muted-foreground">{cours.date} • {cours.heure}</p>
                          <p className="text-xs text-muted-foreground">Salle {cours.salle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Formations Tab */}
          <TabsContent value="formations">
            <Card>
              <CardHeader>
                <CardTitle>Mes Formations</CardTitle>
                <CardDescription>Suivi de votre progression dans vos formations</CardDescription>
              </CardHeader>
              <CardContent>
                {formations.map((formation, index) => (
                  <div key={index} className="p-6 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{formation.nom}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-green-500 text-white">{formation.statut}</Badge>
                          <Badge variant="secondary" className={formation.remaining > 0 ? "text-orange-600 border-orange-200" : "text-blue-600 border-blue-200"}>
                            {formation.payment_status}
                          </Badge>
                          <Badge variant="secondary">Début: {formation.debut}</Badge>
                          <Badge variant="secondary">Fin: {formation.fin}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary mb-1">{formation.progression}%</div>
                        <p className="text-sm text-muted-foreground">Progression</p>
                      </div>
                    </div>
                    <Progress value={formation.progression} className="h-3 mb-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Tronc Commun</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Terminé</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Spécialité</p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium">En cours</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Stage</p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">À venir</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Examen</p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">À venir</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paiements Tab */}
          <TabsContent value="paiements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  Historique des Paiements
                </CardTitle>
                <CardDescription>Suivez l'état de vos paiements</CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="min-w-[520px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paiements.map((paiement, index) => (
                      <TableRow key={index}>
                        <TableCell>{paiement.date}</TableCell>
                        <TableCell className="hidden sm:table-cell">{paiement.type}</TableCell>
                        <TableCell className="font-semibold">{paiement.montant}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge className={paiement.statut === "Payé" ? "bg-green-500 text-white w-fit" : "bg-yellow-500 text-white w-fit"}>
                              {paiement.statut}
                            </Badge>
                            {paiement.statut === "Payé" && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 w-fit">
                                Tranche
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {paiements.some(p => p.statut === "En attente") && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-2">⚠️ Paiement en attente</p>
                    <p className="text-sm text-yellow-700 mb-4">Vous avez un paiement en attente. Veuillez régulariser votre situation.</p>
                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      Effectuer un Paiement
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendrier Tab */}
          <TabsContent value="calendrier">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  Calendrier des Cours
                </CardTitle>
                <CardDescription>Consultez votre emploi du temps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calendrier.map((cours, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                        <p className="text-xs text-primary font-medium">{cours.date.split('/')[0]}</p>
                        <p className="text-lg font-bold text-primary">{cours.date.split('/')[1]}</p>
                        <p className="text-xs text-primary">{cours.date.split('/')[2]}</p>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{cours.cours}</h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {cours.heure}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            Salle {cours.salle}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Mes Documents
                </CardTitle>
                <CardDescription>Téléchargez vos documents et attestations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.nom}</p>
                          <p className="text-sm text-muted-foreground">{doc.type} • {doc.date}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-accent" />
                  Notifications
                </CardTitle>
                <CardDescription>Restez informé des dernières actualités</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notif, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${!notif.lu ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{notif.titre}</h4>
                        {!notif.lu && (
                          <Badge className="bg-blue-500 text-white">Nouveau</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                      <p className="text-xs text-muted-foreground">{notif.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
