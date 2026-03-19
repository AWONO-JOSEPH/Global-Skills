import { Link } from "react-router";
import { MapPin, Phone, Mail, Facebook } from "lucide-react";
import logo from "../../assets/84498a56cb9356abc2f9404869c93b519e727718.png";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Global Skills Logo" className="h-12 w-auto" />
              <div>
                <h3 className="font-bold text-lg">GLOBAL SKILLS</h3>
                <p className="text-sm text-white/80">For a Limitless Future</p>
              </div>
            </div>
            <p className="text-sm text-white/80">
              Institut de Formation Professionnelle innovant dédié à offrir des formations de qualité adaptées aux besoins du marché.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/formations" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Nos Formations
                </Link>
              </li>
              <li>
                <Link to="/services-internationaux" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Services Internationaux
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Formations */}
          <div>
            <h4 className="font-bold text-lg mb-4">Nos Formations</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Formations Professionnelles</li>
              <li>Langues Internationales</li>
              <li>Auto-École</li>
              <li>Marketing Digital</li>
              <li>Développement Web</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/80">
                  Yaoundé – Ngousso<br />
                  Immeuble MEZA CLUB, 3e étage
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="tel:+237640204112" className="text-sm text-white/80 hover:text-accent transition-colors">
                  +237 640 20 41 12
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="https://wa.me/237680379602" className="text-sm text-white/80 hover:text-accent transition-colors">
                  +237 680 37 96 02 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="mailto:globalskills524@gmail.com" className="text-sm text-white/80 hover:text-accent transition-colors">
                  globalskills524@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="#" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Global Skills Vocational Training Institute
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} Global Skills Vocational Training Institute. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
