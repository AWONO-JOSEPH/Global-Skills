import { apiUrl } from "../lib/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { User, Lock, GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import logo from "../../assets/84498a56cb9356abc2f9404869c93b519e727718.png";

type UserRole = "student" | "teacher" | "admin";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("student");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl("/api/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...loginData, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.message ||
          "Échec de la connexion. Veuillez vérifier vos identifiants.";
        toast.error(message);
        return;
      }

      const data = await response.json();
      localStorage.setItem("gs_token", data.token ?? "");
      localStorage.setItem("gs_role", data.user?.role ?? role);
      if (data.user?.email) {
        localStorage.setItem("gs_email", data.user.email);
      }

      if (data.user?.must_change_password) {
        toast.success("Connexion réussie. Veuillez changer votre mot de passe.");
        navigate("/change-password");
        return;
      }

      toast.success("Connexion réussie !");

      if (role === "student") {
        navigate("/student");
      } else if (role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      toast.error("Impossible de contacter le serveur. Réessayez plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: "email" | "password", value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Veuillez renseigner votre adresse email.");
      return;
    }
    setIsSendingReset(true);
    try {
      const response = await fetch(apiUrl("/api/forgot-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || "Erreur lors de la demande de réinitialisation.";
        toast.error(message);
        return;
      }

      toast.success(
        data?.message ??
          "Un mot de passe temporaire a été envoyé à votre adresse email."
      );
      setForgotEmail("");
    } catch {
      toast.error("Impossible de contacter le serveur. Réessayez plus tard.");
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-secondary flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src={logo} alt="Global Skills Logo" className="h-16 w-auto brightness-0 invert" />
            <div className="text-white text-left">
              <h1 className="text-2xl font-bold">GLOBAL SKILLS</h1>
              <p className="text-sm text-white/80">For a Limitless Future</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Choisissez votre espace de connexion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="student"
              className="w-full"
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Étudiant</TabsTrigger>
                <TabsTrigger value="teacher">Formateur</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              {(["student", "teacher", "admin"] as UserRole[]).map((tabRole) => (
                <TabsContent key={tabRole} value={tabRole}>
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor={`${tabRole}-email`}>Email</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`${tabRole}-email`}
                          type="email"
                          placeholder={
                            tabRole === "admin"
                              ? "admin@globalskills.com"
                              : "votre.email@exemple.com"
                          }
                          className="pl-10"
                          value={loginData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`${tabRole}-password`}>Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`${tabRole}-password`}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={loginData.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Connexion..." : "Se Connecter"}
                    </Button>
                    <div className="text-center text-sm">
                      <form
                        onSubmit={handleForgotPassword}
                        className="flex flex-col gap-2 items-center"
                      >
                        <Input
                          type="email"
                          placeholder="Votre email pour réinitialiser"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="h-8 text-xs max-w-xs"
                        />
                        <Button
                          type="submit"
                          variant="ghost"
                          className="h-8 px-2 text-xs text-primary"
                          disabled={isSendingReset}
                        >
                          {isSendingReset ? "Envoi..." : "Mot de passe oublié ?"}
                        </Button>
                      </form>
                    </div>
                  </form>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <a href="/contact" className="text-primary hover:underline font-semibold">
                  Contactez-nous
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-white/80 text-sm">
          <p>© 2026 Global Skills. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
