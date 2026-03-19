import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  GraduationCap, 
  Globe, 
  Award, 
  Users, 
  BookOpen, 
  Briefcase,
  Star,
  ArrowRight,
  Languages,
  Car,
  Laptop,
  TrendingUp
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Home() {
  const testimonials = [
    {
      name: "Marie Kamga",
      formation: "Marketing Digital",
      text: "Grâce à Global Skills, j'ai acquis les compétences nécessaires pour lancer ma propre entreprise. Les formateurs sont excellents et le stage en entreprise m'a ouvert de nombreuses portes.",
      rating: 5,
    },
    {
      name: "Cécile Marie-ange",
      formation: "Secrétariat Bureautique",
      text: "Formation pratique et professionnelle. J'ai trouvé un emploi deux mois après la fin de ma formation. Je recommande vivement !",
      rating: 5,
    },
    {
      name: "Aisha Bello",
      formation: "Langues - Anglais",
      text: "Les cours d'anglais m'ont permis d'améliorer considérablement mon niveau. Aujourd'hui, je travaille dans une entreprise internationale.",
      rating: 5,
    },
  ];

  const popularFormations = [
    {
      id: 1,
      title: "Marketing Digital",
      category: "Formation Professionnelle",
      duration: "12 mois",
      level: "Tous niveaux",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      title: "Développeur d'Application",
      category: "Formation Professionnelle",
      duration: "12 mois",
      level: "Tous niveaux",
      icon: Laptop,
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      title: "Langues Internationales",
      category: "Formation Courte Durée",
      duration: "3 mois",
      level: "Tous niveaux",
      icon: Languages,
      image: "https://images.unsplash.com/photo-1558443957-d056622df610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGxlYXJuaW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3MjUzMDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 4,
      title: "Auto-École",
      category: "Formation Courte Durée",
      duration: "3 mois",
      level: "Débutant",
      icon: Car,
      image: "https://images.unsplash.com/photo-1764547169175-9b7d2736324e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcml2aW5nJTIwc2Nob29sJTIwaW5zdHJ1Y3RvcnxlbnwxfHx8fDE3NzI2MTU2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const stats = [
    { icon: Users, label: "Étudiants Formés", value: "500+" },
    { icon: Award, label: "Certifications Délivrées", value: "450+" },
    { icon: Briefcase, label: "Taux d'Insertion", value: "85%" },
    { icon: GraduationCap, label: "Formateurs Experts", value: "25+" },
  ];

  const whyChooseUs = [
    {
      icon: BookOpen,
      title: "Formation Pratique",
      description: "Nos formations sont axées sur la pratique et les compétences directement applicables en entreprise.",
    },
    {
      icon: Briefcase,
      title: "Stages en Entreprise",
      description: "Chaque formation inclut un stage pratique pour une expérience professionnelle réelle.",
    },
    {
      icon: Users,
      title: "Encadrement Professionnel",
      description: "Des formateurs expérimentés et passionnés vous accompagnent tout au long de votre parcours.",
    },
    {
      icon: Award,
      title: "Certifications Reconnues",
      description: "Obtenez des certifications reconnues qui valorisent votre parcours professionnel.",
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
                Vocational Training Institute
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                GLOBAL SKILLS
              </h1>
              <p className="text-2xl md:text-3xl font-semibold mb-4 text-accent">
                For a Limitless Future
              </p>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Institut de Formation Professionnelle innovant dédié à développer vos compétences et booster votre carrière.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/formations">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Découvrir nos Formations
                  </Button>
                </Link>
                <Link to="/services-internationaux">
                  <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-gray-500 hover:bg-white hover:text-primary w-full sm:w-auto">
                    <Globe className="mr-2 h-5 w-5" />
                    Étudier à l'Étranger
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1744809482817-9a9d4fc280af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3R1ZGVudHMlMjBjbGFzc3Jvb20lMjBsZWFybmluZ3xlbnwxfHx8fDE3NzI1MzA2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Étudiants en formation"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-10 w-10 mx-auto mb-3 text-accent" />
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              À Propos de Global Skills
            </h2>
            <p className="text-lg text-muted-foreground">
              GLOBAL SKILLS est un Institut de Formation Professionnelle innovant et dynamique, 
              dédié à offrir des formations professionnelles de qualité adaptées aux besoins du marché du travail actuel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Notre Mission</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Renforcer le potentiel d'employabilité de nos apprenants</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Booster leur carrière actuelle et future</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Développer leurs compétences opérationnelles</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>Favoriser le développement personnel et professionnel</span>
                </li>
              </ul>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Formation professionnelle"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Formations Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Formations Populaires
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos formations les plus demandées, conçues pour vous préparer aux métiers d'avenir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularFormations.map((formation) => (
              <Card key={formation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={formation.image}
                    alt={formation.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-accent text-white">
                    {formation.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <formation.icon className="h-5 w-5 text-accent" />
                    {formation.title}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center justify-between mt-2">
                      <span>Durée: {formation.duration}</span>
                      <span>{formation.level}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={`/formations/${formation.id}`}>
                    <Button variant="outline" className="w-full">
                      Voir détails
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/formations">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Voir toutes les formations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Pourquoi Choisir Global Skills ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nous mettons l'accent sur la formation pratique et l'acquisition de compétences directement applicables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Témoignages de nos Étudiants
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Découvrez ce que nos anciens étudiants disent de leur expérience chez Global Skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <CardTitle className="text-white">{testimonial.name}</CardTitle>
                  <CardDescription className="text-white/80">{testimonial.formation}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à Commencer Votre Formation ?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Inscrivez-vous dès aujourd'hui et donnez un nouvel élan à votre carrière professionnelle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/formations">
              <Button size="lg" variant="secondary" className="bg-white text-accent hover:bg-white/90 w-full sm:w-auto">
                <GraduationCap className="mr-2 h-5 w-5" />
                S'inscrire à une Formation
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-gray-500 hover:bg-white/10 w-full sm:w-auto">
                Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
