import { apiUrl } from "../lib/api";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  User, 
  Lock, 
  Upload, 
  Trash2, 
  Save,
  ArrowLeft,
  Camera,
  Shield,
  Info,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { getCurrentAuth, logout } from "../auth";

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Données du formulaire - Informations personnelles
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Données du formulaire - Mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const auth = getCurrentAuth();
    if (!auth) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(
          apiUrl(`/api/profile?email=${encodeURIComponent(auth.email)}`),
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors du chargement du profil");
        }

        const user = await response.json();

        setPersonalInfo({
          firstName: user.first_name ?? "",
          lastName: user.last_name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
        });

        if (user.avatar_url) {
          setAvatarUrl(user.avatar_url);
        } else if (user.photo) {
          setAvatarUrl(user.photo);
        } else {
          setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=f97316&color=fff`);
        }
      } catch (error) {
        toast.error("Impossible de charger votre profil.");
      }
    };

    loadProfile();
  }, [navigate]);

  // Gestion de l'upload de photo
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload de la photo
      await uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const auth = getCurrentAuth();
      if (!auth) return;

      formData.append('email', auth.email);
      const endpoint = '/api/profile/photo';
      
      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.photo);
        toast.success("Photo de profil mise à jour avec succès");
      } else {
        toast.error("Erreur lors du téléchargement de la photo");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      await uploadPhoto(file);
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl("/api/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          email: personalInfo.email,
          phone: personalInfo.phone,
        }),
      });

      if (response.ok) {
        toast.success("Informations personnelles mises à jour avec succès");
        // Mettre à jour les informations dans le localStorage
        const auth = getCurrentAuth();
        if (auth) {
          const updatedAuth = {
            ...auth,
            name: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
            email: personalInfo.email,
          };
          localStorage.setItem('auth', JSON.stringify(updatedAuth));
        }
      } else {
        toast.error("Erreur lors de la mise à jour des informations");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/change-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: personalInfo.email,
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Mot de passe changé avec succès");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        const error = await response.json();
        toast.error(error.message || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
  };

  const handleAvatarClick = () => {
    if (avatarUrl && !avatarUrl.includes('ui-avatars.com')) {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
      modal.onclick = () => modal.remove();
      
      const modalImg = document.createElement('img');
      modalImg.src = avatarUrl;
      modalImg.className = 'max-w-full max-h-full rounded-lg';
      
      modal.appendChild(modalImg);
      document.body.appendChild(modal);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      toast.info("Fonctionnalité de suppression de compte non encore implémentée");
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
                <p className="text-xs text-white/80">Paramètres</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo de profil */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Photo de profil
                </CardTitle>
                <CardDescription>
                  Cliquez sur votre photo pour l'agrandir ou sur le bouton + pour la modifier
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div
                    className="w-32 h-32 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-105 border-4 border-background"
                    onClick={handleAvatarClick}
                  >
                    <img
                      src={avatarUrl}
                      alt="Photo de profil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 bg-primary text-white rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                <div
                  className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Glissez une image ici ou cliquez pour sélectionner
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations personnelles et mot de passe */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Votre email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Mot de passe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-accent" />
                  Mot de passe
                </CardTitle>
                <CardDescription>
                  Changez votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Entrez votre mot de passe actuel"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Entrez votre nouveau mot de passe"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirmez votre nouveau mot de passe"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Suppression du compte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Supprimer le compte
                </CardTitle>
                <CardDescription>
                  Attention : cette action est irréversible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    La suppression de votre compte entraînera la perte permanente de toutes vos données.
                  </AlertDescription>
                </Alert>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="mt-4"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer mon compte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
