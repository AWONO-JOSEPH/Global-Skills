import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  GraduationCap, 
  Clock, 
  Users, 
  Award, 
  CheckCircle,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  ArrowRight,
  Globe,
  FileText,
  Headphones
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function IELTSPreparation() {
  const features = [
    {
      icon: Users,
      title: "Formateurs Certifiés",
      description: "Enseignants expérimentés et certifiés IELTS",
    },
    {
      icon: Target,
      title: "Tests Blancs",
      description: "Simulations d'examen pour vous préparer efficacement",
    },
    {
      icon: BookOpen,
      title: "Matériel Pédagogique",
      description: "Supports de cours complets et mis à jour",
    },
    {
      icon: Headphones,
      title: "Laboratoire de Langue",
      description: "Exercices d'écoute et de compréhension orale",
    },
  ];

  const modules = [
    {
      title: "Listening (Écoute)",
      description: "Compréhension orale avec accents variés",
      duration: "12 heures",
      topics: ["Conversations quotidiennes", "Discours académiques", "Instructions et directions"],
    },
    {
      title: "Reading (Lecture)",
      description: "Analyse de textes académiques et généraux",
      duration: "15 heures",
      topics: ["Articles scientifiques", "Textes journalistiques", "Documents administratifs"],
    },
    {
      title: "Writing (Écriture)",
      description: "Rédaction académique et argumentative",
      duration: "18 heures",
      topics: ["Task 1: Description de graphiques", "Task 2: Essai argumenté", "Structure et cohérence"],
    },
    {
      title: "Speaking (Expression Orale)",
      description: "Fluidité et précision en anglais",
      duration: "15 heures",
      topics: ["Part 1: Introduction", "Part 2: Sujet long", "Part 3: Discussion approfondie"],
    },
  ];

  const results = [
    { number: "95%", label: "Taux de réussite" },
    { number: "7.5", label: "Score moyen obtenu" },
    { number: "200+", label: "Étudiants formés" },
    { number: "6", label: "Semaines de formation" },
  ];

  const testimonials = [
    {
      name: "Marie Tchamda",
      score: "8.0",
      text: "Grâce à la préparation IELTS de Global Skills, j'ai obtenu le score requis pour mon master au Canada. Les formateurs sont excellents !",
      university: "Université de Montréal",
    },
    {
      name: "Jean-Pierre Nkoulou",
      score: "7.5",
      text: "La méthode d'enseignement est très efficace. J'ai particulièrement apprécié les tests blancs qui m'ont permis de me familiariser avec l'examen.",
      university: "Imperial College London",
    },
    {
      name: "Aminatou Bello",
      score: "7.0",
      text: "Formation intensive et bien structurée. Le suivi personnalisé m'a aidé à progresser rapidement en expression orale.",
      university: "University of Sydney",
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
                Formation Certifiante
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Préparation à l'Examen IELTS
              </h1>
              <p className="text-xl md:text-2xl font-semibold mb-4 text-accent">
                Atteignez le Score Requis pour Votre Avenir
              </p>
              <p className="text-lg mb-8 text-white/90">
                Notre programme de préparation IELTS aide les étudiants à atteindre 
                le score requis pour leurs projets d'études ou d'immigration à l'étranger.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Informations Clés</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
                    <span><strong>Durée :</strong> 6 semaines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    <span><strong>Niveau :</strong> Intermédiaire</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <span><strong>Mode :</strong> Présentiel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" />
                    <span><strong>Certificat :</strong> Inclus</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact?subject=Inscription IELTS">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto">
                    <BookOpen className="mr-2 h-5 w-5" />
                    S'inscrire Maintenant
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-gray-500 hover:bg-white hover:text-primary w-full sm:w-auto">
                  <FileText className="mr-2 h-5 w-5" />
                  Télécharger le Programme
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJRUxUUyUyMHRlc3QlMjBwcmVwYXJhdGlvbiUyMGNsYXNzcm9vbXxlbnwwfHx8fDE3NzI1MjYzODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Salle de classe IELTS"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Nos Résultats
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des résultats prouvés qui témoignent de l'efficacité de notre méthode
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((result, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-accent mb-2">{result.number}</div>
                  <p className="text-muted-foreground">{result.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Pourquoi Nous Choisir?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une approche complète et personnalisée pour votre succès
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Programme de Formation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les 4 compétences testées au IELTS, maîtrisées en profondeur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <Badge variant="outline">{module.duration}</Badge>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {module.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Témoignages de Nos Étudiants
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leurs succès sont notre meilleure référence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                      <GraduationCap className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.university}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Badge className="bg-accent text-white">Score: {testimonial.score}</Badge>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à Réussir Votre IELTS?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre programme et obtenez le score dont vous avez besoin pour réaliser vos projets internationaux
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact?subject=Prise de rendez-vous IELTS">
              <Button size="lg" variant="secondary" className="bg-white text-accent hover:bg-white/90 w-full sm:w-auto">
                <Calendar className="mr-2 h-5 w-5" />
                Prendre Rendez-vous
              </Button>
            </Link>
            <Link to="/contact?subject=Information IELTS">
              <Button size="lg" variant="outline" className="border-white text-gray-500 hover:bg-white/10 w-full sm:w-auto">
                <Globe className="mr-2 h-5 w-5" />
                Contacter un Conseiller
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
