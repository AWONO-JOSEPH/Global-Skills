import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { 
  Eye, 
  Phone, 
  Mail, 
  Trash2,
  RefreshCw,
  MessageSquare,
  Users,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { apiUrl } from "../../lib/api";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-red-100 text-red-800";
      case "read": return "bg-green-100 text-green-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl("/api/admin/contact-messages"));
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
      const response = await fetch(apiUrl(`/api/admin/contact-messages/${id}`));
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
      const response = await fetch(apiUrl(`/api/admin/contact-messages/${id}/status`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(apiUrl(`/api/admin/contact-messages/${id}`), {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              Messages de Contact
            </h1>
            <p className="text-muted-foreground">
              Gérez les messages reçus via le formulaire de contact
            </p>
          </div>
        </div>
        <Button onClick={fetchMessages} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nouveaux</p>
                <p className="text-2xl font-bold text-red-600">
                  {messages.filter(m => m.status === "new").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lus</p>
                <p className="text-2xl font-bold text-green-600">
                  {messages.filter(m => m.status === "read").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Archivés</p>
                <p className="text-2xl font-bold text-gray-600">
                  {messages.filter(m => m.status === "archived").length}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer par statut</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des messages</CardTitle>
          <CardDescription>
            {messages.length} message{messages.length > 1 ? "s" : ""} trouvé{messages.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Chargement...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucun message trouvé</p>
            </div>
          ) : (
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{message.email}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {message.subject || "Sans sujet"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(message.status)}>
                        {message.status_label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{message.created_at}</TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            fetchMessageDetail(message.id);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContact("email", message.email)}
                        >
                          <Mail className="h-4 w-4" />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedMessage ? (
            <>
              <DialogHeader>
                <DialogTitle>Détails du message</DialogTitle>
                <DialogDescription>
                  Message de {selectedMessage.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nom complet</label>
                    <p>{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p>{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Téléphone</label>
                    <p>{selectedMessage.phone || "Non spécifié"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sujet</label>
                    <p>{selectedMessage.subject || "Sans sujet"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <p className="bg-muted p-3 rounded-md mt-1 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date de réception</label>
                    <p>{selectedMessage.created_at}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Changer le statut</label>
                  <Select
                    value={selectedMessage.status}
                    onValueChange={(value) => updateStatus(selectedMessage.id, value)}
                    disabled={updatingStatus === selectedMessage.id}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.slice(1).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleContact("phone", selectedMessage.phone || "")}
                    variant="outline"
                    className="flex-1"
                    disabled={!selectedMessage.phone}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Appeler
                  </Button>
                  <Button
                    onClick={() => handleContact("email", selectedMessage.email)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Chargement des détails...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}