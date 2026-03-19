import { useParams, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Clock, 
  Award, 
  BookOpen, 
  Briefcase, 
  CheckCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  FileText
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const formationsDetail = [
  {
    id: 8,
    title: "Marketing Digital",
    category: "Formation Professionnelle 14 mois",
    duration: "14 mois",
    price: "À partir de 150,000 FCFA",
    level: "Tous niveaux",
    image:
      "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Maîtrisez les stratégies et outils du marketing digital pour développer la présence en ligne des entreprises et booster leur croissance.",
    objectifs: [
      "Comprendre les fondamentaux du marketing digital",
      "Maîtriser les réseaux sociaux professionnels",
      "Créer et gérer des campagnes publicitaires en ligne",
      "Analyser les performances et optimiser les stratégies",
      "Développer une présence digitale efficace",
    ],
    programme: [
      {
        phase: "Tronc Commun (3 mois)",
        modules: [
          "Introduction au marketing digital",
          "Outils bureautiques professionnels",
          "Communication digitale",
          "Gestion de projet",
        ],
      },
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "SEO et référencement naturel",
          "Social Media Marketing",
          "Google Ads et publicité en ligne",
          "Email Marketing",
          "Analytics et mesure de performance",
          "Content Marketing",
        ],
      },
      {
        phase: "Stage en Entreprise (2 mois)",
        modules: [
          "Application pratique en entreprise",
          "Gestion de projets réels",
          "Encadrement professionnel",
        ],
      },
      {
        phase: "Mémoire et Examen (6 mois)",
        modules: [
          "Rédaction du mémoire professionnel",
          "Période de rattrapage",
          "Examen final et certification",
        ],
      },
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Maîtrise de base de l'outil informatique",
      "Motivation et engagement",
    ],
    debouches: [
      "Community Manager",
      "Chef de projet digital",
      "Consultant en marketing digital",
      "Traffic Manager",
      "Content Manager",
      "Entrepreneur digital",
    ],
  },
  {
    id: 12,
    title: "Développeur d'Application",
    category: "Formation Professionnelle 14 mois",
    duration: "14 mois",
    price: "À partir de 150,000 FCFA",
    level: "Tous niveaux",
    image:
      "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Apprenez à concevoir et développer des applications web et mobiles modernes adaptées aux besoins des entreprises.",
    objectifs: [
      "Maîtriser les langages de base du développement",
      "Comprendre les architectures web modernes",
      "Développer des APIs et interfaces utilisateur",
      "Assurer la qualité et la maintenance des applications",
    ],
    programme: [
      {
        phase: "Tronc Commun (3 mois)",
        modules: ["Algorithmique", "Bureautique", "Bases de la programmation", "Git & outils de travail collaboratif"],
      },
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Développement front-end",
          "Développement back-end",
          "Bases de données",
          "Projet fil rouge",
        ],
      },
      {
        phase: "Stage en Entreprise (2 mois)",
        modules: ["Intégration en équipe", "Développement de fonctionnalités réelles"],
      },
      {
        phase: "Mémoire et Examen (6 mois)",
        modules: ["Projet de fin d’études", "Soutenance", "Examen final"],
      },
    ],
    prerequis: ["Niveau Baccalauréat ou équivalent", "Goût pour la logique et la résolution de problèmes"],
    debouches: [
      "Développeur web",
      "Développeur mobile",
      "Intégrateur d’applications",
      "Technicien en développement",
    ],
  },
  {
    id: 101,
    title: "Langues Internationales",
    category: "Formation Courte Durée 4 mois",
    duration: "4 mois",
    price: "À partir de 50,000 FCFA",
    level: "Tous niveaux",
    image:
      "https://images.unsplash.com/photo-1558443957-d056622df610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGxlYXJuaW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3MjUzMDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Perfectionnez votre niveau de langues étrangères (allemand, anglais, arabe, chinois, français, espagnol, italien, russe).",
    objectifs: [
      "Améliorer la compréhension orale et écrite",
      "Renforcer l’expression orale",
      "Acquérir le vocabulaire professionnel de base",
    ],
    programme: [
      {
        phase: "Modules principaux",
        modules: ["Compréhension orale", "Expression orale", "Lecture et compréhension", "Écriture"],
      },
    ],
    prerequis: ["Aucun prérequis, tous niveaux acceptés"],
    debouches: ["Assistant bilingue", "Emplois nécessitant la maîtrise d’une langue étrangère"],
  },
  {
    id: 102,
    title: "Auto-École",
    category: "Formation Courte Durée 2 mois",
    duration: "2 mois",
    price: "À partir de 80,000 FCFA",
    level: "Débutant",
    image:
      "https://images.unsplash.com/photo-1764547169175-9b7d2736324e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcml2aW5nJTIwc2Nob29sJTIwaW5zdHJ1Y3RvcnxlbnwxfHx8fDE3NzI2MTU2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Préparez-vous efficacement à l’examen du permis de conduire avec des cours théoriques et pratiques.",
    objectifs: [
      "Maîtriser le code de la route",
      "Acquérir les bases de la conduite",
      "Préparer l'examen théorique et pratique",
    ],
    programme: [
      {
        phase: "Théorie",
        modules: ["Code de la route", "Signalisation", "Sécurité routière"],
      },
      {
        phase: "Pratique",
        modules: ["Conduite en ville", "Conduite sur route", "Manoeuvres d’examen"],
      },
    ],
    prerequis: ["Âge minimum requis pour l’inscription à l’examen", "Dossier administratif complet"],
    debouches: ["Obtention du permis de conduire", "Meilleure employabilité dans les métiers nécessitant la conduite"],
  },
] as const;

export default function FormationDetail() {
  const { id } = useParams();
  const numericId = Number(id);
  const formation = formationsDetail.find((f) => f.id === numericId);

  if (!formation) {
    return (
      <div className="flex flex-col">
        <div className="bg-muted py-4">
          <div className="container mx-auto px-4">
            <Link to="/formations">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux formations
              </Button>
            </Link>
          </div>
        </div>
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground">
              Cette formation n'existe pas ou n'a pas encore de page de détail configurée.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Back Button */}
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <Link to="/formations">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux formations
            </Button>
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-accent text-white">
                {formation.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {formation.title}
              </h1>
              <p className="text-lg text-white/90 mb-6">
                {formation.description}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-white/80">Durée</p>
                    <p className="font-semibold">{formation.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-white/80">Niveau</p>
                    <p className="font-semibold">{formation.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-white/80">Prix</p>
                    <p className="font-semibold">{formation.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-white/80">Prochaine session</p>
                    <p className="font-semibold">Avril 2026</p>
                  </div>
                </div>
              </div>
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  S'inscrire Maintenant
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <ImageWithFallback
                src={formation.image}
                alt={formation.title}
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Objectifs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-accent" />
                    Objectifs de la Formation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {formation.objectifs.map((objectif, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span>{objectif}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Programme */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-accent" />
                    Programme de Formation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {formation.programme.map((phase, index) => (
                      <div key={index}>
                        <h4 className="font-bold text-lg text-primary mb-3">
                          {phase.phase}
                        </h4>
                        <ul className="space-y-2 ml-4">
                          {phase.modules.map((module, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="h-2 w-2 rounded-full bg-accent flex-shrink-0 mt-2"></div>
                              <span className="text-muted-foreground">{module}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Débouchés */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-accent" />
                    Débouchés Professionnels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formation.debouches.map((debouche, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        {debouche}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prérequis */}
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-accent" />
                    Conditions d'Admission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {formation.prerequis.map((prerequis, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{prerequis}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Informations */}
              <Card className="bg-gradient-to-br from-primary to-secondary text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Informations Pratiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-white/80 mb-1">Horaires</p>
                    <p className="font-semibold">Cours du jour et du soir</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">Certification</p>
                    <p className="font-semibold">Attestation reconnue</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">Effectif</p>
                    <p className="font-semibold">Maximum 20 étudiants/classe</p>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="bg-accent text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Prêt à Commencer ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/90">
                    Inscrivez-vous dès maintenant ou contactez-nous pour plus d'informations.
                  </p>
                  <Link to="/contact">
                    <Button className="w-full bg-white text-accent hover:bg-white/90">
                      S'inscrire Maintenant
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                      Nous Contacter
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
