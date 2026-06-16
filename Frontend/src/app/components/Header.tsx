import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/84498a56cb9356abc2f9404869c93b519e727718.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/formations", label: "Formations" },
    { path: "/services-internationaux", label: "Services Internationaux" },
    { path: "/Partenaires", label: "Nos Partenaires" },
    { path: "/contact", label: "Contact" },
    { path: "/news", label: "Actualités" },
  ];

  const isActive = (path: string) => location.pathname === path;

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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
