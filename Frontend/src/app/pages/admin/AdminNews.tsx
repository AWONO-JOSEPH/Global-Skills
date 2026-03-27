import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Image as ImageIcon,
  Video,
  Save,
  X,
  CalendarDays,
  Newspaper,
  ArrowLeft
} from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import logo from "../../../assets/84498a56cb9356abc2f9404869c93b519e727718.png";
import { apiUrl } from "../../lib/api";

type NewsPublication = {
  id: number;
  title: string;
  description: string;
  category: string;
  published_at?: string;
  image?: string;
  video?: string;
};

export default function AdminNews() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Annonce"
  });

  const [publications, setPublications] = useState<NewsPublication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
        setMediaType(fileType);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchPublications = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl("/api/news"), {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Erreur lors du chargement des actualités");
        const data: NewsPublication[] = await response.json();
        setPublications(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les actualités.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublications();
  }, []);

  const handleCreatePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      if (mediaFile) {
        if (mediaType === 'image') data.append('image', mediaFile);
        else if (mediaType === 'video') data.append('video', mediaFile);
      }
      let response: Response;
      if (editingId) {
        data.append('_method', 'PUT');
        response = await fetch(apiUrl(`/api/news/${editingId}`), {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json" },
          body: data,
        });
      } else {
        response = await fetch(apiUrl("/api/news"), {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json" },
          body: data,
        });
      }
      if (!response.ok) throw new Error("Erreur lors de l'enregistrement de l'actualité");
      const saved: NewsPublication = await response.json();
      if (editingId) {
        setPublications((prev) => prev.map((pub) => (pub.id === editingId ? saved : pub)));
        toast({ title: "Publication modifiée", description: "L'actualité a été mise à jour avec succès." });
        setEditingId(null);
      } else {
        setPublications((prev) => [saved, ...prev]);
        toast({ title: "Publication créée", description: "La nouvelle actualité a été publiée avec succès." });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'enregistrer l'actualité.", variant: "destructive" });
      return;
    }
    setFormData({ title: "", description: "", category: "Annonce" });
    setMediaPreview("");
    setMediaType(null);
    setMediaFile(null);
    setShowCreateForm(false);
  };

  const handleEdit = (publication: NewsPublication) => {
    setFormData({ title: publication.title, description: publication.description, category: publication.category });
    setMediaPreview(publication.image || publication.video || "");
    setMediaType(publication.image ? 'image' : publication.video ? 'video' : null);
    setEditingId(publication.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      try {
        const response = await fetch(apiUrl(`/api/news/${id}`), {
          method: "DELETE",
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!response.ok && response.status !== 204) throw new Error("Erreur lors de la suppression");
        setPublications((prev) => prev.filter((pub) => pub.id !== id));
        toast({ title: "Publication supprimée", description: "L'actualité a été supprimée avec succès." });
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer l'actualité.", variant: "destructive" });
      }
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", category: "Annonce" });
    setMediaPreview("");
    setMediaType(null);
    setMediaFile(null);
    setEditingId(null);
    setShowCreateForm(false);
  };

  const categoryColors: Record<string, string> = {
    "Annonce": "bg-blue-50 text-blue-700 border-blue-200",
    "Événement": "bg-purple-50 text-purple-700 border-purple-200",
    "Partenariat": "bg-green-50 text-green-700 border-green-200",
    "Programme": "bg-orange-50 text-orange-700 border-orange-200",
    "Actualité": "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>

      {/* ── Header ── */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-50"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/admin" className="flex items-center gap-3 min-w-0">
              <img src={logo} alt="Global Skills Logo" className="h-8 sm:h-10 w-auto brightness-0 invert flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold tracking-wide leading-tight truncate">GLOBAL SKILLS</h1>
                <p className="text-xs text-white/70 hidden sm:block">Gestion des Actualités</p>
              </div>
            </Link>
            <Link to="/admin" className="flex-shrink-0">
              <Button variant="ghost" size="sm"
                className="text-white hover:bg-white/15 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 rounded-lg border border-white/20">
                <ArrowLeft className="h-3.5 w-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Retour au Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-5xl">

        {/* ── Page title bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-1">
              Actualités
            </h2>
            <p className="text-sm text-muted-foreground">
              Créez, modifiez et supprimez les actualités du site public
            </p>
          </div>
          {!showCreateForm && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-accent hover:bg-accent/90 self-start sm:self-auto text-white font-semibold px-5 h-10 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle publication
            </Button>
          )}
        </div>

        {/* ── Create / Edit form ── */}
        {showCreateForm && (
          <div className="mb-8 rounded-2xl border border-primary/15 bg-white shadow-xl overflow-hidden"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
            {/* Form header stripe */}
            <div className="bg-primary/5 border-b border-primary/10 px-6 py-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Newspaper className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-primary text-base sm:text-lg">
                  {editingId ? "Modifier l'actualité" : "Nouvelle actualité"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingId ? "Modifiez les informations de cette publication" : "Remplissez les informations pour créer une nouvelle actualité"}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <form onSubmit={handleCreatePublication} className="space-y-5">

                {/* Title + Category row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Titre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Lancement de la nouvelle promotion 2026"
                      required
                      className="h-10 rounded-xl border-slate-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Catégorie
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-background px-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                    >
                      <option value="Annonce">Annonce</option>
                      <option value="Événement">Événement</option>
                      <option value="Partenariat">Partenariat</option>
                      <option value="Programme">Programme</option>
                      <option value="Actualité">Actualité</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez votre actualité en détail..."
                    rows={5}
                    required
                    className="rounded-xl border-slate-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 resize-none transition-all"
                  />
                </div>

                {/* Media upload */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Image ou Vidéo <span className="text-muted-foreground font-normal normal-case">(optionnel)</span>
                  </Label>
                  <div className={`rounded-xl border-2 border-dashed transition-all duration-200 ${mediaPreview ? 'border-primary/30 bg-primary/3' : 'border-slate-200 hover:border-primary/30 bg-slate-50/50'}`}>
                    {mediaPreview ? (
                      <div className="p-4 space-y-3">
                        {mediaType === 'image' ? (
                          <img src={mediaPreview} alt="Aperçu" className="max-h-56 mx-auto rounded-lg shadow-md object-cover" />
                        ) : (
                          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                            <Video className="h-8 w-8 text-primary/60" />
                            <span className="font-medium">Vidéo sélectionnée</span>
                          </div>
                        )}
                        <Button type="button" variant="outline" size="sm"
                          onClick={() => { setMediaPreview(""); setMediaType(null); setMediaFile(null); }}
                          className="w-full h-9 rounded-lg border-slate-200 text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all">
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Supprimer le média
                        </Button>
                      </div>
                    ) : (
                      <div className="py-10 px-6 text-center">
                        <div className="h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-3">
                          <Upload className="h-5 w-5 text-primary/60" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">Téléchargez une image ou une vidéo</p>
                        <p className="text-xs text-muted-foreground mb-4">PNG, JPG, MP4 jusqu'à 10 MB</p>
                        <Button type="button" variant="outline" size="sm"
                          onClick={() => document.getElementById('media-upload')?.click()}
                          className="h-9 rounded-lg border-primary/30 text-primary hover:bg-primary/5 transition-all">
                          <ImageIcon className="h-4 w-4 mr-2" /> Parcourir les fichiers
                        </Button>
                        <input id="media-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaUpload} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Auto date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                  <CalendarDays className="h-3.5 w-3.5 text-primary/50 flex-shrink-0" />
                  <span>Date de publication : <strong>{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button type="submit"
                    className="bg-primary hover:bg-primary/90 h-10 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 order-1 sm:order-none">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? "Enregistrer les modifications" : "Publier l'actualité"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}
                    className="h-10 px-5 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                    <X className="h-4 w-4 mr-2" /> Annuler
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Publications list ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-700 flex items-center gap-2">
              <span>Publications</span>
              <span className="inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {publications.length}
              </span>
            </h3>
          </div>

          {publications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Newspaper className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium text-sm">Aucune actualité publiée pour le moment</p>
              <p className="text-slate-400 text-xs mt-1">Créez votre première publication ci-dessus</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {publications.map((publication) => (
                <div key={publication.id}
                  className="group rounded-2xl bg-white border border-slate-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/15"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div className="flex flex-col sm:flex-row">

                    {/* Media thumbnail */}
                    {(publication.image || publication.video) && (
                      <div className="sm:w-36 sm:flex-shrink-0">
                        {publication.image ? (
                          <img src={publication.image} alt={publication.title}
                            className="w-full sm:w-36 h-40 sm:h-full object-cover" />
                        ) : (
                          <div className="w-full sm:w-36 h-36 bg-slate-100 flex items-center justify-center">
                            <Video className="h-7 w-7 text-slate-400" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3 min-w-0">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${categoryColors[publication.category] || categoryColors["Actualité"]}`}>
                            {publication.category}
                          </span>
                          {publication.published_at && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarDays className="h-3 w-3" />
                              {publication.published_at}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-800 text-base sm:text-lg leading-snug mb-1.5 line-clamp-2">
                          {publication.title}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {publication.description}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(publication)}
                          className="h-8 px-3 rounded-lg border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 text-xs font-medium transition-all duration-200">
                          <Edit className="h-3.5 w-3.5 mr-1.5" /> Modifier
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(publication.id)}
                          className="h-8 px-3 rounded-lg border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-medium transition-all duration-200">
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}