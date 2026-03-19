import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="text-center text-white">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-4xl font-bold mb-4">Page Non Trouvée</h2>
        <p className="text-xl mb-8 text-white/80">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Home className="mr-2 h-5 w-5" />
              Retour à l'Accueil
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Page Précédente
          </Button>
        </div>
      </div>
    </div>
  );
}
