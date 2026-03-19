import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Handshake, Globe2, Building2, ArrowRight } from "lucide-react";

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
  description: "Entreprise experte en logistique, transport, transit et messagerie, offrant des opportunités de stages et d’immersion professionnelle aux apprenants en gestion et supply chain.",
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
  description: "Agence immobilière partenaire pour l’insertion professionnelle des apprenants dans les métiers de la gestion, du commerce et de l’immobilier.",
  country: "Cameroun",
  website: undefined,
},
{
  name: "Université de Yaoundé II",
  type: "Université",
  description: "Institution académique publique partenaire pour l’encadrement académique, la validation des acquis et la poursuite d’études supérieures des apprenants.",
  country: "Cameroun",
  website: "https://site.univ-yaounde2.org/",
},
{
  name: "MINEFOP",
  type: "Ministère",
  description: "Ministère en charge de l’Emploi et de la Formation Professionnelle, partenaire institutionnel pour l’accréditation, l’insertion professionnelle et l’accompagnement des jeunes formés.",
  country: "Cameroun",
  website: "http://www.minefop.cm/fr/",
},
{
  name: "MINTRANSPORT",
  type: "Ministère",
  description: "Ministère des Transports, partenaire sectoriel pour l’orientation et l’insertion des apprenants dans les métiers du transport et de la logistique.",
  country: "Cameroun",
  website: "https://mintransports.cm/",
},
{
  name: "FNE",
  type: "Agence",
  description: "Fonds National de l’Emploi, partenaire pour l’accompagnement à l’insertion professionnelle, aux stages, et au financement de projets des apprenants.",
  country: "Cameroun",
  website: "https://www.fnecm.org/index.php/fr/",
},
];

export default function Partenaires() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Partenaires
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Global Skills collabore avec un réseau de partenaires académiques et professionnels
              pour offrir à nos apprenants des opportunités concrètes de stage, d’emploi et d’études à l’étranger.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Un Réseau de Confiance
            </h2>
            <p className="text-muted-foreground">
              Nos partenariats stratégiques renforcent la qualité de nos formations et facilitent
              l’insertion professionnelle de nos étudiants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-accent" />
                      {partner.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {partner.type}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Globe2 className="h-4 w-4 text-accent" />
                    <span>{partner.country}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground mb-4">
                    {partner.description}
                  </p>

                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-between text-sm"
                      >
                        Visiter le site
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
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
              <p className="text-muted-foreground mb-4">
                Nos partenaires jouent un rôle clé dans le parcours de nos apprenants, de la formation jusqu’à l’insertion professionnelle.
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Accès à des stages en entreprise et à des emplois.</li>
                <li>• Possibilités d’échanges académiques et d’études à l’étranger.</li>
                <li>• Co-certifications et programmes reconnus à l’international.</li>
                <li>• Mise à jour continue de nos programmes selon les besoins du marché.</li>
              </ul>
            </div>
            <div>
              <Card className="border-dashed border-2 border-accent/40">
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
                  <p className="text-sm text-muted-foreground mb-4">
                    Instituts, entreprises, ONG ou administrations : rejoignez notre réseau
                    pour développer des projets de formation, de recrutement ou de mobilité internationale.
                  </p>
                  {/* Tu peux rediriger vers ta page Contact */}
                  <Link to="/contact">
                    <Button className="w-full bg-primary hover:bg-primary/90">
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
