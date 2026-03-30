import { apiUrl, apiFetch } from "../lib/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getCurrentAuth, logout } from "../auth";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const auth = getCurrentAuth();
    if (!auth) {
      logout();
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getCurrentAuth();
    if (!auth) {
      logout();
      navigate("/login");
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (formData.new_password !== formData.new_password_confirmation) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/change-password", {
        method: "POST",
        body: JSON.stringify({
          email: auth.email,
          current_password: formData.current_password,
          new_password: formData.new_password,
          new_password_confirmation: formData.new_password_confirmation,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || "Erreur lors du changement de mot de passe.";
        toast.error(message);
        return;
      }

      toast.success("Mot de passe mis à jour avec succès.");

      // Redirection vers le tableau de bord en fonction du rôle
      if (auth.role === "student") {
        navigate("/student");
      } else if (auth.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/admin");
      }
    } catch {
      toast.error("Impossible de contacter le serveur. Réessayez plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Changer mon mot de passe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="current_password">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Mot de passe actuel
                </Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.current_password}
                    onChange={(e) =>
                      setFormData({ ...formData, current_password: e.target.value })
                    }
                    className="pr-10"
                    required
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
                <Label htmlFor="new_password">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Nouveau mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.new_password}
                    onChange={(e) =>
                      setFormData({ ...formData, new_password: e.target.value })
                    }
                    className="pr-10"
                    required
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
                <Label htmlFor="new_password_confirmation">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="new_password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.new_password_confirmation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        new_password_confirmation: e.target.value,
                      })
                    }
                    className="pr-10"
                    required
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
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : "Valider"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

