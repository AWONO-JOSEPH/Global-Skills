import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Facebook, Send } from "lucide-react";
import { toast } from "sonner";
import { apiUrl, apiFetch } from "../lib/api";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });

  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    if (subjectParam) {
      setFormData((prev) => ({ ...prev, sujet: subjectParam }));
    }
  }, [searchParams]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiFetch("/api/contact-messages", {
        method: "POST",
        body: JSON.stringify({
          name: formData.nom,
          email: formData.email,
          phone: formData.telephone,
          subject: formData.sujet,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Votre message a été envoyé avec succès.");
        setFormData({
          nom: "",
          email: "",
          telephone: "",
          sujet: "",
          message: "",
        });
      } else {
        toast.error(data.message || "Une erreur est survenue lors de l'envoi du message.");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      content: "Yaoundé – Ngousso\nImmeuble MEZA CLUB, 3e étage",
      link: null,
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+237 640 20 41 12",
      link: "tel:+237640204112",
    },
    {
      icon: Phone,
      title: "WhatsApp",
      content: "+237 680 37 96 02",
      link: "https://wa.me/237680379602",
    },
    {
      icon: Mail,
      title: "Email",
      content: "globalskills524@gmail.com",
      link: "mailto:globalskills524@gmail.com",
    },
    {
      icon: Clock,
      title: "Horaires",
      content: "Lundi - Vendredi: 8h00 - 18h00\nSamedi: 9h00 - 14h00",
      link: null,
    },
    {
      icon: Facebook,
      title: "Facebook",
      content: "Global Skills Vocational Training Institute",
      link: "#",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contactez-Nous
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Nous sommes là pour répondre à toutes vos questions. N'hésitez pas à nous contacter !
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">
                Informations de Contact
              </h2>
              <p className="text-muted-foreground mb-8">
                Vous pouvez nous joindre par téléphone, email ou directement à notre bureau. 
                Notre équipe est disponible pour vous accompagner dans votre projet de formation.
              </p>

              <div className="grid grid-cols-1 gap-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <info.icon className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                          {info.link ? (
                            <a 
                              href={info.link} 
                              className="text-muted-foreground hover:text-accent transition-colors whitespace-pre-line"
                              target={info.link.startsWith('http') ? '_blank' : undefined}
                              rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <Card className="mt-6 bg-green-500 text-white border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Contactez-nous sur WhatsApp</h3>
                      <p className="text-sm text-white/90">Réponse rapide et assistance instantanée</p>
                    </div>
                    <a href="https://wa.me/237680379602" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="secondary" className="bg-white text-green-500 hover:bg-white/90">
                        <Phone className="mr-2 h-5 w-5" />
                        WhatsApp
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Envoyez-nous un Message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="nom">Nom Complet *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="votre.email@exemple.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          placeholder="+237 6XX XX XX XX"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sujet">Sujet *</Label>
                      <Input
                        id="sujet"
                        value={formData.sujet}
                        onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                        placeholder="L'objet de votre message"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Écrivez votre message ici..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {isSubmitting ? "Envoi en cours..." : "Envoyer le Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Notre Localisation
            </h2>
            <p className="text-muted-foreground">
              Yaoundé – Ngousso, Immeuble MEZA CLUB, 3e étage
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.863086771844!2d11.516667!3d3.866667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNTInMDAuMCJOIDExwrAzMScwMC4wIkU!5e0!3m2!1sen!2scm!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Global Skills Location"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-primary">
                Questions Fréquentes
              </h2>
              <p className="text-muted-foreground">
                Vous avez des questions ? Voici quelques réponses rapides
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comment puis-je m'inscrire ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Vous pouvez vous inscrire directement à notre bureau, par téléphone ou en remplissant le formulaire de contact. 
                    Notre équipe vous contactera pour finaliser votre inscription.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quels sont les modes de paiement acceptés ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nous acceptons les paiements en espèces, par virement bancaire et par mobile money. 
                    Des facilités de paiement échelonné sont également disponibles.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Les formations sont-elles certifiées ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Oui, toutes nos formations délivrent des attestations reconnues. Les formations professionnelles de 12 mois 
                    incluent un examen final et un mémoire professionnel.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proposez-vous des cours du soir ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Oui, nous proposons des cours du jour et du soir pour s'adapter à votre emploi du temps. 
                    Contactez-nous pour connaître les horaires disponibles.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
