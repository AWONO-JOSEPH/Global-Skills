import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router";
import {
  Globe,
  Plane,
  FileText,
  Award,
  CheckCircle,
  ArrowRight,
  Users,
  BookOpen,
  Building2,
  GraduationCap,
  X,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { apiUrl, apiFetch } from "../lib/api";

export default function InternationalServices() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    pays: "",
    niveau: "",
    domaine: "",
    message: "",
  });

  const [showProjectForm, setShowProjectForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Diviser le nom complet en prénom et nom
    const nameParts = formData.nom.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Validation basique
    if (!firstName || !formData.email || !formData.telephone) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const requestData = {
      first_name: firstName,
      last_name: lastName || 'Non spécifié',
      profession: formData.domaine,
      phone: formData.telephone,
      email: formData.email,
      description: `Pays de destination: ${formData.pays}\nNiveau d'études: ${formData.niveau}\nDomaine: ${formData.domaine}\n\nMessage:\n${formData.message}`,
    };

    try {
      const response = await apiFetch('/api/international-requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message || "Votre demande a été soumise avec succès. Nous vous contacterons prochainement.");
        setFormData({
          nom: "",
          email: "",
          telephone: "",
          pays: "",
          niveau: "",
          domaine: "",
          message: "",
        });
        setShowProjectForm(false);
      } else {
        if (responseData.errors) {
          const errorMessages = Object.values(responseData.errors).flat() as string[];
          toast.error(errorMessages[0] || "Une erreur est survenue lors de la soumission.");
        } else {
          toast.error(responseData.message || "Une erreur est survenue lors de la soumission.");
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erreur de connexion. Veuillez réessayer.");
    }
  };

  const services = [
    {
      icon: Building2,
      title: "Choix de l'Université",
      description: "Nous vous aidons à sélectionner les meilleures universités selon votre profil et vos objectifs académiques.",
    },
    {
      icon: FileText,
      title: "Assistance Visa",
      description: "Accompagnement complet pour la constitution de votre dossier et les démarches administratives.",
    },
    {
      icon: Award,
      title: "Préparation IELTS",
      description: "Formation intensive pour réussir le test IELTS requis pour vos études à l'étranger.",
    },
    {
      icon: Plane,
      title: "Préparation au Départ",
      description: "Conseils pratiques pour votre installation et adaptation dans votre pays d'accueil.",
    },
  ];

  const destinations = [
    { name: "Canada", flag: "🇨🇦", programmes: "120+" },
    { name: "Royaume-Uni", flag: "🇬🇧", programmes: "95+" },
    { name: "États-Unis", flag: "🇺🇸", programmes: "150+" },
    { name: "Australie", flag: "🇦🇺", programmes: "80+" },
    { name: "France", flag: "🇫🇷", programmes: "110+" },
    { name: "Allemagne", flag: "🇩🇪", programmes: "70+" },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Consultation Gratuite",
      description: "Évaluation de votre profil et discussion de vos objectifs académiques",
    },
    {
      number: "02",
      title: "Sélection des Universités",
      description: "Recherche et sélection des établissements adaptés à votre profil",
    },
    {
      number: "03",
      title: "Constitution du Dossier",
      description: "Préparation complète de votre dossier d'admission",
    },
    {
      number: "04",
      title: "Demande de Visa",
      description: "Accompagnement pour les démarches visa et administratives",
    },
    {
      number: "05",
      title: "Préparation au Départ",
      description: "Conseils pratiques et orientation avant votre départ",
    },
    {
      number: "06",
      title: "Suivi Post-Départ",
      description: "Accompagnement continu pendant vos études à l'étranger",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-secondary text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-accent text-white hover:bg-accent/90">
                Chet's Vision - Services Internationaux
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Études à l'Étranger
              </h1>
              <p className="text-xl md:text-2xl font-semibold mb-4 text-accent">
                Réalisez Vos Rêves Académiques
              </p>
              <p className="text-lg mb-8 text-white/90">
                Nous vous accompagnons dans toutes les étapes de votre projet d'études à l'étranger, 
                de la sélection des universités jusqu'à votre installation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white"
                  onClick={() => setShowProjectForm(true)}
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Commencer Mon Projet
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-gray-500 hover:bg-white hover:text-primary"
                  asChild
                >
                  <a
                    href="/assets/images/background/20260410_1921_Image Generation_remix_01knw6fp2ffcmtny1qee6q7g1y.png"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Télécharger la Brochure
                  </a>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <ImageWithFallback
                src="/assets/images/background/20260410_1921_Image Generation_remix_01knw6fp2ffcmtny1qee6q7g1y.png"
                alt="Étudiants internationaux"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Nos Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un accompagnement complet pour réussir votre projet d'études à l'étranger
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <service.icon className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Destinations Populaires
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Accédez aux meilleures universités dans les pays les plus prisés
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {destinations.map((destination, index) => (
              <Card
                key={index}
                className="relative overflow-hidden text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Drapeau en arrière-plan, très grand et transparent */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[5rem] opacity-10" aria-hidden="true">
                    {destination.flag}
                  </span>
                </div>

                <CardHeader className="relative z-10">
                  {/* Drapeau normal au-dessus */}
                  <div className="text-3xl mb-2">{destination.flag}</div>
                  <CardTitle className="text-lg">{destination.name}</CardTitle>
                  <CardDescription>{destination.programmes} programmes</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Notre Processus
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un accompagnement structuré en 6 étapes pour garantir votre succès
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 text-8xl font-bold text-accent/5">
                  {step.number}
                </div>
                <CardHeader className="relative z-10">
                  <Badge className="w-fit mb-2 bg-accent text-white">Étape {step.number}</Badge>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* IELTS Preparation Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary to-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Préparation IELTS
              </h2>
              <p className="text-lg text-white/90 mb-6">
                Obtenez le score IELTS requis pour vos études à l'étranger grâce à notre programme de préparation intensive.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span>Formateurs certifiés et expérimentés</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span>Tests blancs et simulations d'examen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span>Modules adaptés à votre niveau</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span>Suivi personnalisé et coaching</span>
                </li>
              </ul>
              <Link to="/ielts-preparation">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  <BookOpen className="mr-2 h-5 w-5" />
                  S'inscrire à la Préparation IELTS
                </Button>
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Nos Résultats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">95%</div>
                  <p className="text-white/80">Taux de réussite</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">7.5</div>
                  <p className="text-white/80">Score moyen</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">200+</div>
                  <p className="text-white/80">Étudiants formés</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">4 sem</div>
                  <p className="text-white/80">Programme intensif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section (popup-style when starting a project) */}
      {showProjectForm && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-3xl px-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Formulaire de Pré-évaluation</CardTitle>
                  <CardDescription>
                    Remplissez ce formulaire pour une évaluation gratuite de votre profil
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProjectForm(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom Complet *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telephone">Téléphone *</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pays">Pays de Destination *</Label>
                      <Select
                        value={formData.pays}
                        onValueChange={(value) => setFormData({ ...formData, pays: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="uk">Royaume-Uni</SelectItem>
                          <SelectItem value="usa">États-Unis</SelectItem>
                          <SelectItem value="australia">Australie</SelectItem>
                          <SelectItem value="france">France</SelectItem>
                          <SelectItem value="germany">Allemagne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="niveau">Niveau d'Études *</Label>
                      <Select
                        value={formData.niveau}
                        onValueChange={(value) => setFormData({ ...formData, niveau: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bac">Baccalauréat</SelectItem>
                          <SelectItem value="licence">Licence</SelectItem>
                          <SelectItem value="master">Master</SelectItem>
                          <SelectItem value="doctorat">Doctorat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="domaine">Domaine d'Études *</Label>
                      <Input
                        id="domaine"
                        value={formData.domaine}
                        onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}
                        placeholder="Ex: Informatique, Business..."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message / Questions</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre projet d'études..."
                      rows={5}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowProjectForm(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
                      Envoyer Ma Demande
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à Partir ?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour une consultation gratuite et commencez votre aventure académique internationale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-accent hover:bg-white/90"
              onClick={() => setShowProjectForm(true)}
            >
              <Users className="mr-2 h-5 w-5" />
              Prendre Rendez-vous
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-gray-500 hover:bg-white/10"
              asChild
            >
              <a href="tel:+237640204112">
                Appeler Maintenant
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
