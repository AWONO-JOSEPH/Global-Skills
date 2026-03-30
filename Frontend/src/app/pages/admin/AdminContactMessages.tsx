import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { 
  Eye, 
  Phone, 
  Mail, 
  Trash2,
  RefreshCw,
  MessageSquare,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Filter
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { apiUrl, apiFetch } from "../../lib/api";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  status: string;
  status_label: string;
  created_at: string;
}

interface MessageDetail extends ContactMessage {
  message: string;
}

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "new", label: "Nouveau" },
    { value: "read", label: "Lu" },
    { value: "archived", label: "Archivé" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "new": return "bg-red-50 text-red-700 border border-red-200";
      case "read": return "bg-green-50 text-green-700 border border-green-200";
      case "archived": return "bg-slate-100 text-slate-600 border border-slate-200";
      default: return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "new": return "bg-red-500";
      case "read": return "bg-green-500";
      case "archived": return "bg-slate-400";
      default: return "bg-slate-400";
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/admin/contact-messages");
      if (response.ok) {
        const data = await response.json();
        const filteredMessages = statusFilter === "all" 
          ? data.messages 
          : data.messages.filter((msg: ContactMessage) => msg.status === statusFilter);
        setMessages(filteredMessages);
      } else {
        toast.error("Erreur lors du chargement des messages");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageDetail = async (id: number) => {
    try {
      setSelectedMessage(null);
      const response = await apiFetch(`/api/admin/contact-messages/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedMessage(data.message);
        // Refresh the list to update "new" to "read"
        fetchMessages();
      } else {
        toast.error("Erreur lors du chargement des détails");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      setUpdatingStatus(id);
      const response = await apiFetch(`/api/admin/contact-messages/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Statut mis à jour avec succès");
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
      } else {
        toast.error("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return;
    }

    try {
      const response = await apiFetch(`/api/admin/contact-messages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Message supprimé avec succès");
        fetchMessages();
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const handleContact = (type: "phone" | "email", value: string) => {
    if (type === "phone") {
      window.open(`tel:${value}`, "_blank");
    } else {
      window.open(`mailto:${value}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-6xl space-y-6 sm:space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm"
                className="self-start h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-primary transition-all shadow-sm text-xs sm:text-sm">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Retour au Dashboard</span>
                <span className="sm:hidden">Retour</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                Messages de Contact
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 ml-0 sm:ml-11">
                Gérez les messages reçus via le formulaire de contact
              </p>
            </div>
          </div>
          <Button onClick={fetchMessages} variant="outline" disabled={loading}
            className="self-start sm:self-auto h-9 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium shadow-sm transition-all">
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className={`rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow`}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Total</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{messages.length}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-slate-500" />
            </div>
          </div>
          <div className={`rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow`}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Nouveaux</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-red-600">
                {messages.filter(m => m.status === "new").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className={`rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow`}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Lus</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-green-600">
                {messages.filter(m => m.status === "read").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className={`rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow`}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Archivés</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-600">
                {messages.filter(m => m.status === "archived").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="h-5 w-5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className="rounded-2xl bg-white border border-slate-100 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 flex-shrink-0">
            <Filter className="h-4 w-4 text-primary/60" />
            Filtrer par statut
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-52 h-9 rounded-xl border-slate-200 text-sm focus:ring-2 focus:ring-primary/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-sm">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground sm:ml-auto">
            {messages.length} message{messages.length > 1 ? "s" : ""} trouvé{messages.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Table card ── */}
        <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div className="px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-base">Liste des messages</h2>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <RefreshCw className="h-7 w-7 animate-spin text-primary/50" />
              <p className="text-sm">Chargement en cours…</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium text-sm">Aucun message trouvé</p>
              <p className="text-slate-400 text-xs">Essayez de modifier le filtre de statut</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-slate-500 py-3 px-5">Nom</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-slate-500 py-3 hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-slate-500 py-3">Sujet</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-slate-500 py-3">Statut</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-slate-500 py-3 hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide text-slate-500 py-3 pr-5">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}
                      className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-semibold text-slate-800 py-3.5 px-5 text-sm">
                        {message.name}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm hidden md:table-cell">
                        {message.email}
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="max-w-[180px] truncate block text-slate-600">
                          {message.subject || <span className="text-slate-400 italic">Sans sujet</span>}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusStyle(message.status)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${getStatusDot(message.status)}`} />
                          {message.status_label}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs hidden lg:table-cell">
                        {message.created_at}
                      </TableCell>
                      <TableCell className="pr-5">
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="sm"
                            onClick={() => { fetchMessageDetail(message.id); setIsDialogOpen(true); }}
                            className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all"
                            title="Voir les détails">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="sm"
                            onClick={() => handleContact("email", message.email)}
                            className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all"
                            title="Envoyer un email">
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* ── Detail Dialog ── */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg sm:max-w-2xl rounded-2xl p-0 overflow-hidden gap-0">
            {selectedMessage ? (
              <>
                {/* Dialog header stripe */}
                <div className="bg-primary/5 border-b border-primary/10 px-6 py-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-primary">
                      Détails du message
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                      Informations complètes sur le message de{" "}
                      <strong className="text-slate-700">{selectedMessage.name}</strong>
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                  {/* Info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Nom complet", value: selectedMessage.name },
                      { label: "Email", value: selectedMessage.email },
                      { label: "Téléphone", value: selectedMessage.phone || "Non spécifié" },
                      { label: "Sujet", value: selectedMessage.subject || "Sans sujet" },
                    ].map((field) => (
                      <div key={field.label}
                        className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{field.label}</p>
                        <p className="text-sm font-medium text-slate-800">{field.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Message content */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Message</p>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Date de réception", value: selectedMessage.created_at },
                    ].map((field) => (
                      <div key={field.label}
                        className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{field.label}</p>
                        <p className="text-sm font-medium text-slate-800">{field.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Status selector */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Changer le statut</p>
                    <Select
                      value={selectedMessage.status}
                      onValueChange={(value) => updateStatus(selectedMessage.id, value)}
                      disabled={updatingStatus === selectedMessage.id}
                    >
                      <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {statusOptions.slice(1).map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-sm">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1 pb-1">
                    <Button onClick={() => handleContact("phone", selectedMessage.phone || "")}
                      variant="outline"
                      className="flex-1 h-10 rounded-xl border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 font-semibold text-sm transition-all"
                      disabled={!selectedMessage.phone}>
                      <Phone className="mr-2 h-4 w-4" /> Appeler
                    </Button>
                    <Button onClick={() => handleContact("email", selectedMessage.email)}
                      variant="outline"
                      className="flex-1 h-10 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-semibold text-sm transition-all">
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </Button>
                    <Button onClick={() => deleteMessage(selectedMessage.id)}
                      variant="destructive"
                      className="h-10 px-4 rounded-xl font-semibold text-sm sm:w-auto">
                      <Trash2 className="h-4 w-4 sm:mr-0" />
                      <span className="sm:hidden ml-2">Supprimer</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="h-7 w-7 animate-spin text-primary/50" />
                <p className="text-sm text-muted-foreground">Chargement des détails…</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}