import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Clock, 
  Award, 
  ArrowRight,
  BookOpen,
  Briefcase,
  TrendingUp,
  Laptop,
  Languages,
  Car,
  Calculator,
  Globe,
  BarChart,
  Shield,
  Package,
  Truck,
  Users,
  FileText,
  Code,
  Image,
  Wifi,
  Video
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Formations() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const formations12Mois = [
    {
      id: 1,
      title: "QHSE",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Shield,
      description: "Qualité, Hygiène, Sécurité et Environnement",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      title: "Douane et Transit",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Package,
      description: "Gestion des opérations douanières et de transit",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      title: "Logistique et Transport",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Truck,
      description: "Gestion de la chaîne logistique et transport",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 4,
      title: "Entrepreneuriat",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Briefcase,
      description: "Création et gestion d'entreprise",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 5,
      title: "Gestion des Projets",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: BarChart,
      description: "Management et gestion de projets",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 6,
      title: "Comptabilité Informatisée",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Calculator,
      description: "Comptabilité avec logiciels spécialisés",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 7,
      title: "Fiscalité",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: FileText,
      description: "Gestion fiscale et déclarations",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 8,
      title: "Marketing Digital",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: TrendingUp,
      description: "Stratégies marketing en ligne",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 9,
      title: "Secrétariat Bureautique",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: BookOpen,
      description: "Gestion administrative et bureautique",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 10,
      title: "Secrétariat Comptable",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Calculator,
      description: "Secrétariat spécialisé en comptabilité",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 11,
      title: "Secrétariat de Direction",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Users,
      description: "Assistant de direction",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 12,
      title: "Développeur d'Application",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Code,
      description: "Développement d'applications web et mobile",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 13,
      title: "Graphisme de Production",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Image,
      description: "Design graphique et production visuelle",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 14,
      title: "Maintenance des Réseaux",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Wifi,
      description: "Maintenance et administration réseaux",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 15,
      title: "Montage Audiovisuel",
      category: "Formation Professionnelle 12 mois",
      duration: "14 mois",
      price: "À partir de 150,000 FCFA",
      level: "Tous niveaux",
      icon: Video,
      description: "Montage vidéo et production audiovisuelle",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const formations3Mois = [
    {
      id: 101,
      title: "Langues Internationales",
      category: "Formation Courte Durée 3 mois",
      duration: "4 mois",
      price: "À partir de 50,000 FCFA",
      level: "Tous niveaux",
      icon: Languages,
      description: "Allemand, Anglais, Arabe, Chinois, Français, Espagnol, Italien, Russe",
      languages: ["Allemand", "Anglais", "Arabe", "Chinois", "Français", "Espagnol", "Italien", "Russe"],
      image: "https://images.unsplash.com/photo-1558443957-d056622df610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGxlYXJuaW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3MjUzMDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 102,
      title: "Auto-École",
      category: "Formation Courte Durée 3 mois",
      duration: "2 mois",
      price: "À partir de 80,000 FCFA",
      level: "Débutant",
      icon: Car,
      description: "Cours théoriques et pratiques, préparation à l'examen, cours du jour et du soir",
      features: ["Cours théoriques", "Cours pratiques", "Préparation à l'examen", "Cours jour et soir"],
      image: "https://images.unsplash.com/photo-1764547169175-9b7d2736324e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcml2aW5nJTIwc2Nob29sJTIwaW5zdHJ1Y3RvcnxlbnwxfHx8fDE3NzI2MTU2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const allFormations = [...formations12Mois, ...formations3Mois];

  const filteredFormations = selectedCategory === "all" 
    ? allFormations 
    : selectedCategory === "12mois" 
    ? formations12Mois 
    : formations3Mois;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Formations
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Découvrez nos programmes de formation professionnelle conçus pour développer vos compétences et booster votre carrière
            </p>
          </div>
        </div>
      </section>

      {/* Formations Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="12mois">12 Mois</TabsTrigger>
              <TabsTrigger value="3mois">3 Mois</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFormations.map((formation) => (
                  <FormationCard key={formation.id} formation={formation} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="12mois" className="mt-0">
              <div className="mb-8 p-6 bg-muted rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-primary">Structure des Formations Professionnelles (12 mois)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">3 mois</p>
                      <p className="text-sm text-muted-foreground">Tronc commun</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">3 mois</p>
                      <p className="text-sm text-muted-foreground">Spécialité</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">2 mois</p>
                      <p className="text-sm text-muted-foreground">Stage en entreprise</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">2 mois</p>
                      <p className="text-sm text-muted-foreground">Rédaction de mémoire</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">1 mois</p>
                      <p className="text-sm text-muted-foreground">Rattrapage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">1 mois</p>
                      <p className="text-sm text-muted-foreground">Examen final</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFormations.map((formation) => (
                  <FormationCard key={formation.id} formation={formation} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="3mois" className="mt-0">
              <div className="mb-8 p-6 bg-muted rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-primary">Structure des Formations Courte Durée (3 mois)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">2 mois</p>
                      <p className="text-sm text-muted-foreground">Cours théoriques et pratiques</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">1 mois</p>
                      <p className="text-sm text-muted-foreground">Stage pratique</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFormations.map((formation) => (
                  <FormationCard key={formation.id} formation={formation} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Besoin de Plus d'Informations ?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Contactez-nous pour discuter de votre projet de formation et découvrir comment nous pouvons vous aider
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-white">
              Nous Contacter
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FormationCard({ formation }: { formation: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <ImageWithFallback
          src={formation.image}
          alt={formation.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 right-3 bg-accent text-white">
          {formation.duration}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <formation.icon className="h-5 w-5 text-accent flex-shrink-0" />
          <span className="line-clamp-1">{formation.title}</span>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {formation.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Niveau</span>
            <span className="font-semibold">{formation.level}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Prix</span>
            <span className="font-semibold text-accent">{formation.price}</span>
          </div>
          {formation.languages && (
            <div className="flex flex-wrap gap-1">
              {formation.languages.slice(0, 3).map((lang: string) => (
                <Badge key={lang} variant="secondary" className="text-xs">
                  {lang}
                </Badge>
              ))}
              {formation.languages.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{formation.languages.length - 3}
                </Badge>
              )}
            </div>
          )}
          <Link to={`/formations/${formation.id}`}>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Voir détails
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
