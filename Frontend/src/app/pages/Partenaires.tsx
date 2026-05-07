import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Handshake, Globe2, Building2, ArrowRight, GraduationCap, Landmark, Briefcase, Home, CheckCircle2 } from "lucide-react";

type Partner = {
  name: string;
  type: string;
  description: string;
  country: string;
  website?: string;
};

const partners: Partner[] = [
  {
    name: "Chet's Vision",
    type: "Entreprise",
    description: "Entreprise spécialisée dans les prestations de services multidisciplinaires, partenaire stratégique pour l'encadrement pratique et le développement des compétences professionnelles.",
    country: "Cameroun",
    website: "https://example-universite.fr",
  },
  {
    name: "SMS Logistique",
    type: "Entreprise",
    description: "Entreprise experte en logistique, transport, transit et messagerie, offrant des opportunités de stages et d'immersion professionnelle aux apprenants en gestion et supply chain.",
    country: "Cameroun",
    website: "https://example-tech.africa",
  },
  {
    name: "Orizon Groupe",
    type: "Entreprise",
    description: "Structure spécialisée dans les certifications linguistiques (anglais, allemand, etc.), partenaire pour le renforcement des compétences linguistiques et la préparation aux examens internationaux.",
    country: "Cameroun",
    website: "https://example-languages.com",
  },
  {
    name: "Prada Immobilier",
    type: "Agence",
    description: "Agence immobilière partenaire pour l'insertion professionnelle des apprenants dans les métiers de la gestion, du commerce et de l'immobilier.",
    country: "Cameroun",
    website: undefined,
  },
  {
    name: "Université de Yaoundé II",
    type: "Université",
    description: "Institution académique publique partenaire pour l'encadrement académique, la validation des acquis et la poursuite d'études supérieures des apprenants.",
    country: "Cameroun",
    website: "https://site.univ-yaounde2.org/",
  },
  {
    name: "MINEFOP",
    type: "Ministère",
    description: "Ministère en charge de l'Emploi et de la Formation Professionnelle, partenaire institutionnel pour l'accréditation, l'insertion professionnelle et l'accompagnement des jeunes formés.",
    country: "Cameroun",
    website: "http://www.minefop.cm/fr/",
  },
  {
    name: "MINTRANSPORT",
    type: "Ministère",
    description: "Ministère des Transports, partenaire sectoriel pour l'orientation et l'insertion des apprenants dans les métiers du transport et de la logistique.",
    country: "Cameroun",
    website: "https://mintransports.cm/",
  },
  {
    name: "FNE",
    type: "Agence",
    description: "Fonds National de l'Emploi, partenaire pour l'accompagnement à l'insertion professionnelle, aux stages, et au financement de projets des apprenants.",
    country: "Cameroun",
    website: "https://www.fnecm.org/index.php/fr/",
  },
];

// Couleur et icône par type de partenaire
const typeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Entreprise: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Briefcase className="h-5 w-5 text-blue-500" />,
  },
  Agence: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Home className="h-5 w-5 text-amber-500" />,
  },
  Université: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <GraduationCap className="h-5 w-5 text-purple-500" />,
  },
  Ministère: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <Landmark className="h-5 w-5 text-emerald-500" />,
  },
};

const whyBenefits = [
  "Accès à des stages en entreprise et à des emplois.",
  "Possibilités d'échanges académiques et d'études à l'étranger.",
  "Co-certifications et programmes reconnus à l'international.",
  "Mise à jour continue de nos programmes selon les besoins du marché.",
];

export default function Partenaires() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-white py-20 md:py-28 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill label */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-sm font-medium mb-6 border border-white/20">
              <Handshake className="h-4 w-4" />
              Réseau de partenaires
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Nos Partenaires
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Global Skills collabore avec un réseau de partenaires académiques et professionnels
              pour offrir à nos apprenants des opportunités concrètes de stage, d'emploi et d'études à l'étranger.
            </p>

            {/* Stats strip */}
            <div className="flex justify-center gap-10 mt-10">
              {[
                { value: `${partners.length}`, label: "Partenaires actifs" },
                { value: "3", label: "Secteurs couverts" },
                { value: "100%", label: "Camerounais" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-white/70 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-primary">
              Un Réseau de Confiance
            </h2>
            <p className="text-muted-foreground">
              Nos partenariats stratégiques renforcent la qualité de nos formations et facilitent
              l'insertion professionnelle de nos étudiants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => {
              const config = typeConfig[partner.type] ?? {
                color: "bg-gray-100 text-gray-700 border-gray-200",
                icon: <Building2 className="h-5 w-5 text-gray-500" />,
              };

              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col border border-border/60"
                >
                  <CardHeader className="pb-3">
                    {/* Icon + name row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${config.color} shrink-0`}>
                          {config.icon}
                        </div>
                        <CardTitle className="text-base leading-snug">
                          {partner.name}
                        </CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 border font-medium px-2.5 py-0.5 ${config.color}`}
                      >
                        {partner.type}
                      </Badge>
                    </div>

                    <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Globe2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>{partner.country}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between pt-0">
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                      {partner.description}
                    </p>

                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex"
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-between text-sm group-hover:border-primary/40 group-hover:text-primary transition-colors"
                        >
                          Visiter le site
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </a>
                    ) : (
                      <div className="h-9" /> // preserve card height when no button
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Partners Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-primary">
                Pourquoi ces Partenariats ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Nos partenaires jouent un rôle clé dans le parcours de nos apprenants, de la formation jusqu'à l'insertion professionnelle.
              </p>
              <ul className="space-y-3">
                {whyBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Card className="border-2 border-accent/30 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Handshake className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Devenir Partenaire
                      </CardTitle>
                      <CardDescription>
                        Vous souhaitez collaborer avec Global Skills ?
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    Instituts, entreprises, ONG ou administrations : rejoignez notre réseau
                    pour développer des projets de formation, de recrutement ou de mobilité internationale.
                  </p>
                  <Link to="/contact">
                    <Button className="w-full bg-primary hover:bg-primary/90 shadow-sm">
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