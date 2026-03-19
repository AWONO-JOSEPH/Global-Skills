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

  // État du formulaire
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Annonce"
  });

  // Liste des actualités
  const [publications, setPublications] = useState<NewsPublication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Gestion de l'upload de média
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
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des actualités");
        }

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

  // Créer ou mettre à jour une publication
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
        if (mediaType === 'image') {
          data.append('image', mediaFile);
        } else if (mediaType === 'video') {
          data.append('video', mediaFile);
        }
      }

      let response: Response;

      if (editingId) {
        // Laravel handles PUT with FormData via _method
        data.append('_method', 'PUT');
        response = await fetch(apiUrl(`/api/news/${editingId}`), {
          method: "POST", // Use POST with _method=PUT for FormData
          headers: {
            Accept: "application/json",
          },
          body: data,
        });
      } else {
        response = await fetch(apiUrl("/api/news"), {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: data,
        });
      }

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de l'actualité");
      }

      const saved: NewsPublication = await response.json();

      if (editingId) {
        setPublications((prev) =>
          prev.map((pub) => (pub.id === editingId ? saved : pub))
        );
        toast({
          title: "Publication modifiée",
          description: "L'actualité a été mise à jour avec succès.",
        });
        setEditingId(null);
      } else {
        setPublications((prev) => [saved, ...prev]);
        toast({
          title: "Publication créée",
          description: "La nouvelle actualité a été publiée avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'actualité.",
        variant: "destructive",
      });
      return;
    }

    // Réinitialiser le formulaire
    setFormData({ title: "", description: "", category: "Annonce" });
    setMediaPreview("");
    setMediaType(null);
    setMediaFile(null);
    setShowCreateForm(false);
  };

  // Modifier une publication
  const handleEdit = (publication: NewsPublication) => {
    setFormData({
      title: publication.title,
      description: publication.description,
      category: publication.category
    });
    setMediaPreview(publication.image || publication.video || "");
    setMediaType(publication.image ? 'image' : publication.video ? 'video' : null);
    setEditingId(publication.id);
    setShowCreateForm(true);
  };

  // Supprimer une publication
  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      try {
        const response = await fetch(apiUrl(`/api/news/${id}`), {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok && response.status !== 204) {
          throw new Error("Erreur lors de la suppression");
        }

        setPublications((prev) => prev.filter((pub) => pub.id !== id));
        toast({
          title: "Publication supprimée",
          description: "L'actualité a été supprimée avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'actualité.",
          variant: "destructive",
        });
      }
    }
  };

  // Annuler la création/édition
  const handleCancel = () => {
    setFormData({ title: "", description: "", category: "Annonce" });
    setMediaPreview("");
    setMediaType(null);
    setMediaFile(null);
    setEditingId(null);
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <img src={logo} alt="Global Skills Logo" className="h-10 w-auto brightness-0 invert" />
              <div>
                <h1 className="text-lg font-bold">GLOBAL SKILLS</h1>
                <p className="text-xs text-white/80">Gestion des Actualités</p>
              </div>
            </Link>
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* En-tête avec bouton de création */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">
              Gestion des Actualités
            </h2>
            <p className="text-muted-foreground">
              Créez, modifiez et supprimez les actualités affichées sur le site public
            </p>
          </div>
          
          {!showCreateForm && (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-accent hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle publication
            </Button>
          )}
        </div>

        {/* Formulaire de création/édition */}
        {showCreateForm && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-accent" />
                {editingId ? "Modifier l'actualité" : "Nouvelle actualité"}
              </CardTitle>
              <CardDescription>
                {editingId 
                  ? "Modifiez les informations de cette publication" 
                  : "Remplissez les informations pour créer une nouvelle actualité"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePublication} className="space-y-6">
                {/* Titre */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Titre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Lancement de la nouvelle promotion 2026"
                    required
                  />
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Annonce">Annonce</option>
                    <option value="Événement">Événement</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Programme">Programme</option>
                    <option value="Actualité">Actualité</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez votre actualité en détail..."
                    rows={5}
                    required
                  />
                </div>

                {/* Upload Image/Vidéo */}
                <div className="space-y-2">
                  <Label>Image ou Vidéo (optionnel)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6">
                    {mediaPreview ? (
                      <div className="space-y-4">
                        {mediaType === 'image' ? (
                          <img 
                            src={mediaPreview} 
                            alt="Aperçu" 
                            className="max-h-64 mx-auto rounded-lg shadow-md"
                          />
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Video className="h-8 w-8" />
                            <span>Vidéo sélectionnée</span>
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setMediaPreview("");
                            setMediaType(null);
                            setMediaFile(null);
                          }}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer le média
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm font-medium mb-1">
                          Téléchargez une image ou une vidéo
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          PNG, JPG, MP4 jusqu'à 10MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('media-upload')?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Parcourir les fichiers
                        </Button>
                        <input
                          id="media-upload"
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={handleMediaUpload}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Date (automatique) */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Date de publication : {new Date().toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? "Enregistrer les modifications" : "Publier"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Liste des publications */}
        <div>
          <h3 className="text-xl font-bold mb-4">
            Publications actuelles ({publications.length})
          </h3>
          
          {publications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune actualité publiée pour le moment
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {publications.map((publication) => (
                <Card key={publication.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Média */}
                      {(publication.imageUrl || publication.videoUrl) && (
                        <div className="flex-shrink-0">
                          {publication.imageUrl ? (
                            <img 
                              src={publication.imageUrl} 
                              alt={publication.title}
                              className="w-full md:w-32 h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full md:w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                              <Video className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Contenu */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="font-bold text-lg mb-1">
                              {publication.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                              <Badge variant="outline" className="text-xs">
                                {publication.category}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {publication.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {publication.description}
                        </p>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(publication)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(publication.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
