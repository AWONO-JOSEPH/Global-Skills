import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Facebook, Send, MessageCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    nom: "", email: "", telephone: "", sujet: "", message: "",
  });

  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    if (subjectParam) setFormData((prev) => ({ ...prev, sujet: subjectParam }));
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
        toast.success(data.message || "Message envoyé avec succès.");
        setFormData({ nom: "", email: "", telephone: "", sujet: "", message: "" });
      } else {
        toast.error(data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, title: "Adresse", content: "Yaoundé – Ngousso\nImmeuble MEZA CLUB, 3e étage", link: null },
    { icon: Phone, title: "Téléphone", content: "+237 640 20 41 12", link: "tel:+237640204112" },
    { icon: MessageCircle, title: "WhatsApp", content: "+237 680 37 96 02", link: "https://wa.me/237680379602" },
    { icon: Mail, title: "Email", content: "globalskills524@gmail.com", link: "mailto:globalskills524@gmail.com" },
    { icon: Clock, title: "Horaires", content: "Lun - Ven: 8h - 18h\nSamedi: 9h - 14h", link: null },
    { icon: Facebook, title: "Facebook", content: "Global Skills Institute", link: "#" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Parlons de votre <span className="text-accent italic">Avenir</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Une question sur nos formations ? Notre équipe d'experts est là pour vous guider vers la carrière qui vous correspond.
            </p>
          </div>
        </div>
      </section>

      {/* --- Main Content --- */}
      <section className="py-16 md:py-24 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-4">Informations de Contact</h2>
                <p className="text-muted-foreground">
                  Choisissez le canal qui vous convient le mieux. Nous nous engageons à vous répondre sous 24 heures.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{info.title}</h3>
                        {info.link ? (
                          <a href={info.link} className="text-foreground font-medium hover:text-primary transition-colors block">
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium whitespace-pre-line">{info.content}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Enhanced WhatsApp Card */}
              <div className="relative group overflow-hidden rounded-3xl bg-green-600 p-8 text-white shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">Besoin d'une réponse immédiate ?</h3>
                    <p className="text-green-50/80">Nos conseillers sont en ligne sur WhatsApp.</p>
                  </div>
                  <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50 font-bold px-8 shadow-xl">
                    <a href="https://wa.me/237680379602" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5 fill-current" /> WhatsApp
                    </a>
                  </Button>
                </div>
                <MessageCircle className="absolute -bottom-10 -right-10 h-40 w-40 text-white/10 rotate-12" />
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <Card className="border-none shadow-2xl shadow-primary/5">
                <CardHeader className="space-y-1 pb-8">
                  <CardTitle className="text-2xl font-bold">Envoyez un message</CardTitle>
                  <CardDescription>Les champs marqués d'une étoile (*) sont obligatoires.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom Complet *</Label>
                        <Input id="nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} placeholder="Ex: Jean Dupont" required className="bg-muted/30 focus-visible:ring-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input id="telephone" type="tel" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} placeholder="+237 ..." required className="bg-muted/30" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Professionnel *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="nom@exemple.com" required className="bg-muted/30" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sujet">Sujet de votre demande *</Label>
                      <Input id="sujet" value={formData.sujet} onChange={(e) => setFormData({ ...formData, sujet: e.target.value })} placeholder="Comment pouvons-nous vous aider ?" required className="bg-muted/30" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Votre Message *</Label>
                      <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Décrivez votre besoin en quelques mots..." rows={5} required className="bg-muted/30 resize-none" />
                    </div>

                    <Button type="submit" size="lg" className="w-full h-12 text-md font-bold transition-all active:scale-[0.98]" disabled={isSubmitting}>
                      {isSubmitting ? "Envoi en cours..." : <><Send className="mr-2 h-5 w-5" /> Envoyer le message</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* --- Map Section --- */}
      <section className="py-16 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                <MapPin className="h-8 w-8 text-accent" /> Nous rendre visite
              </h2>
              <p className="text-muted-foreground mt-2">Passez nous voir pour un entretien d'orientation gratuit dans nos locaux à Yaoundé.</p>
            </div>
            <Button variant="outline" asChild>
              <a href="https://maps.google.com" target="_blank">Ouvrir dans Google Maps</a>
            </Button>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-inner bg-muted h-[450px] border-4 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.863086771844!2d11.5519742947541!3d3.8996798560136114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwA1MnNTkuNiJOIDExwrAzMScwNy4xIkU!5e0!3m2!1sen!2scm!4v1234567890"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Location"
            />
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4" variant="secondary">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Questions Fréquentes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { q: "Comment puis-je m'inscrire ?", r: "Directement en agence ou via ce formulaire. Un conseiller vous rappellera." },
              { q: "Modes de paiement ?", r: "Espèces, Virement, Mobile Money. Possibilité de paiement échelonné." },
              { q: "Formations certifiées ?", r: "Oui, attestations reconnues et préparation aux diplômes d'État." },
              { q: "Cours du soir ?", r: "Disponible pour la majorité de nos programmes techniques." }
            ].map((faq, i) => (
              <Card key={i} className="bg-card hover:border-primary/50 transition-colors cursor-default">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-3 italic">
                    <HelpCircle className="h-5 w-5 text-accent" /> {faq.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.r}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Petit composant utilitaire pour les badges si non présent dans vos UI
function Badge({ children, className, variant = "default" }: any) {
  const styles = variant === "secondary" ? "bg-accent/10 text-accent" : "bg-primary text-white";
  return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${styles} ${className}`}>{children}</span>;
}
