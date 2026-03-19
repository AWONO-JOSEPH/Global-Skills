import { apiUrl } from "../lib/api";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../../assets/84498a56cb9356abc2f9404869c93b519e727718.png";
import { getCurrentAuth, logout } from "../auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "teacher" | "admin" | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/formations", label: "Formations" },
    { path: "/services-internationaux", label: "Services Internationaux" },
    { path: "/Partenaires", label: "Nos Partenaires" },
    { path: "/contact", label: "Contact" },
    { path: "/news", label: "Actualités" },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const loadAuthAndProfile = async () => {
      const auth = getCurrentAuth();
      setRole(auth?.role ?? null);

      if (!auth) {
        setAvatarUrl(null);
        setDisplayName(null);
        return;
      }

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
          throw new Error("Erreur profil");
        }

        const user = await response.json();

        if (user.avatar_url) {
          setAvatarUrl(user.avatar_url);
        } else {
          setAvatarUrl(null);
        }

        const fullName =
          [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          user.name ||
          auth.email;
        setDisplayName(fullName);
      } catch {
        setAvatarUrl(null);
        setDisplayName(null);
      }
    };

    loadAuthAndProfile();
  }, [location.pathname]);

  const goToDashboard = () => {
    if (role === "student") {
      navigate("/student");
    } else if (role === "teacher") {
      navigate("/teacher");
    } else if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  const getInitials = () => {
    if (displayName) {
      const parts = displayName.trim().split(" ");
      const first = parts[0]?.[0] ?? "";
      const last = parts[1]?.[0] ?? "";
      return (first + last || first).toUpperCase();
    }
    return "GS";
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Global Skills Logo" className="h-12 w-auto" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-primary">GLOBAL SKILLS</h1>
              <p className="text-orange-600 text-muted-foreground">For a Limitless Future</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-accent ${
                  isActive(link.path) ? "text-accent" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Zone */}
          <div className="hidden lg:flex items-center gap-4">
            {role ? (
              <>
                <button
                  type="button"
                  onClick={goToDashboard}
                  className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-muted transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={displayName ?? "Profil"} />
                    ) : (
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">
                      {role === "admin"
                        ? "Admin"
                        : role === "teacher"
                        ? "Formateur"
                        : "Étudiant"}
                    </span>
                    <span className="text-xs font-medium max-w-[140px] truncate">
                      {displayName ?? ""}
                    </span>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    setRole(null);
                    setAvatarUrl(null);
                    setDisplayName(null);
                    navigate("/");
                  }}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium transition-colors hover:text-accent ${
                    isActive(link.path) ? "text-accent" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {role ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      goToDashboard();
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {role === "admin"
                      ? "Espace Admin"
                      : role === "teacher"
                      ? "Espace Formateur"
                      : "Espace Étudiant"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1"
                    onClick={() => {
                      logout();
                      setRole(null);
                      setIsMenuOpen(false);
                      navigate("/");
                    }}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
