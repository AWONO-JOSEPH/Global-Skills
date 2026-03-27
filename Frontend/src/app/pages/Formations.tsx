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
  Video,
  DollarSign,
  GraduationCap,
  ChevronRight,
  Layers,
  Monitor,
  BookMarked
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Formations() {
  const [selectedCategory, setSelectedCategoryState] = useState(localStorage.getItem("formations_category") || "all");

  const setSelectedCategory = (cat: string) => {
    setSelectedCategoryState(cat);
    localStorage.setItem("formations_category", cat);
  };

  // ── FORMATIONS GÉNÉRALES (12 mois) ─────────────────────────────────────────
  const formationsGenerales = [
    {
      id: 1,
      title: "QHSE",
      category: "Formation Professionnelle",
      subCategory: "generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BAC / GCE A Level",
      icon: Shield,
      description: "Qualité, Hygiène, Sécurité et Environnement",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      title: "Douane et Transit",
      category: "Formation Professionnelle",
      subCategory: "generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BAC / GCE A Level",
      icon: Package,
      description: "Gestion des opérations douanières et de transit",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      title: "Logistique et Transport",
      category: "Formation Professionnelle",
      subCategory: "generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BAC / GCE A Level",
      icon: Truck,
      description: "Gestion de la chaîne logistique et transport",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 4,
      title: "Entrepreneuriat",
      category: "Formation Professionnelle",
      subCategory: "generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BEPC / GCE O Level",
      icon: Briefcase,
      description: "Création et gestion d'entreprise",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 5,
      title: "Gestion des Projets",
      category: "Formation Professionnelle",
      subCategory: "generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BAC / GCE A Level",
      icon: BarChart,
      description: "Management et gestion de projets",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 7,
      title: "Fiscalité",
      category: "Formation Professionnelle",
      subCategory: "generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BAC / GCE A Level",
      icon: FileText,
      description: "Gestion fiscale et déclarations",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 11,
      title: "Secrétariat de Direction",
      category: "Formation Professionnelle",
      subCategory: "generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BAC / GCE A Level",
      icon: Users,
      description: "Assistant de direction et gestion administrative",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  // ── FORMATIONS FORTEMENT LIÉES À L'INFORMATIQUE (12 mois) ──────────────────
  const formationsInfoGenerales = [
    {
      id: 8,
      title: "Marketing Digital",
      category: "Formation Professionnelle",
      subCategory: "info-generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BAC / GCE A Level",
      icon: TrendingUp,
      description: "Stratégies marketing en ligne",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 9,
      title: "Secrétariat Bureautique",
      category: "Formation Professionnelle",
      subCategory: "info-generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BEPC / GCE O Level",
      icon: BookOpen,
      description: "Gestion administrative et bureautique",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 10,
      title: "Secrétariat Comptable",
      category: "Formation Professionnelle",
      subCategory: "info-generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "Probatoire / Lower Sixth",
      icon: Calculator,
      description: "Secrétariat spécialisé en comptabilité",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 6,
      title: "Comptabilité Informatisée et Gestion",
      category: "Formation Professionnelle",
      subCategory: "info-generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "Terminale / Upper Sixth",
      icon: Calculator,
      description: "Comptabilité avec logiciels spécialisés",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 13,
      title: "Graphisme de Production",
      category: "Formation Professionnelle",
      subCategory: "info-generales",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "350 000 FCFA",
      inscription: "25 000 FCFA",
      level: "Terminale / Upper Sixth",
      icon: Image,
      description: "Design graphique et production visuelle",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  // ── FORMATIONS PUREMENT INFORMATIQUES (12 mois) ────────────────────────────
  const formationsInfo = [
    {
      id: 12,
      title: "Développement d'Applications",
      category: "Formation Informatique",
      subCategory: "informatique",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "400 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BAC / GCE A Level",
      icon: Code,
      description: "Développement d'applications web et mobile",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 14,
      title: "Maintenance des Réseaux Informatiques",
      category: "Formation Informatique",
      subCategory: "informatique",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "400 000 FCFA",
      inscription: "25 000 FCFA",
      level: "Terminale / Upper Sixth",
      icon: Wifi,
      description: "Maintenance et administration réseaux",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 15,
      title: "Montage Audio Visuel",
      category: "Formation Informatique",
      subCategory: "informatique",
      duration: "12 mois",
      shortDuration: "4 mois",
      price: "400 000 FCFA",
      inscription: "25 000 FCFA",
      level: "BEPC / GCE O Level",
      icon: Video,
      description: "Montage vidéo et production audiovisuelle",
      diplome: "DQP / CQP",
      image: "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  // ── FORMATIONS COURTE DURÉE ────────────────────────────────────────────────
  const formations3Mois = [
    {
      id: 101,
      title: "Langues Internationales",
      category: "Formation Courte Durée",
      subCategory: "courte",
      duration: "Variable",
      shortDuration: null,
      price: "À partir de 35 000 FCFA",
      inscription: "À partir de 10 000 FCFA",
      level: "Tous niveaux",
      icon: Languages,
      description: "Allemand, Anglais, Arabe, Chinois, Français, Espagnol, Italien, Russe",
      languages: ["Allemand", "Anglais", "Arabe", "Chinois", "Français", "Espagnol", "Italien", "Russe"],
      diplome: "Attestation + Certification internationale",
      image: "https://images.unsplash.com/photo-1558443957-d056622df610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGxlYXJuaW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3MjUzMDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 102,
      title: "Auto-École",
      category: "Formation Courte Durée",
      subCategory: "courte",
      duration: "Variable",
      shortDuration: null,
      price: "70 000 FCFA",
      inscription: "10 000 FCFA",
      level: "Tous niveaux",
      icon: Car,
      description: "Cours théoriques et pratiques, préparation à l'examen, cours du jour et du soir",
      features: ["Cours théoriques", "Cours pratiques", "Préparation à l'examen", "Cours jour et soir"],
      diplome: "Permis de conduire",
      examFee: "30 000 FCFA",
      image: "https://images.unsplash.com/photo-1764547169175-9b7d2736324e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcml2aW5nJTIwc2Nob29sJTIwaW5zdHJ1Y3RvcnxlbnwxfHx8fDE3NzI2MTU2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const allFormations = [...formationsGenerales, ...formationsInfoGenerales, ...formationsInfo, ...formations3Mois];

  // ── Catégories pour le filtre ──────────────────────────────────────────────
  const categories = [
    { value: "all", label: "Toutes", icon: Layers, count: allFormations.length },
    { value: "generales", label: "Générales", icon: BookMarked, count: formationsGenerales.length },
    { value: "info-generales", label: "Informatique & Gestion", icon: Monitor, count: formationsInfoGenerales.length },
    { value: "informatique", label: "Informatique", icon: Code, count: formationsInfo.length },
    { value: "courte", label: "Courte Durée", icon: Clock, count: formations3Mois.length },
  ];

  const filteredFormations = selectedCategory === "all"
    ? allFormations
    : allFormations.filter((f) => f.subCategory === selectedCategory);

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Formations</h1>
            <p className="text-lg md:text-xl text-white/90">
              Découvrez nos programmes de formation professionnelle conçus pour développer vos compétences et booster votre carrière
            </p>
            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl mx-auto">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">{allFormations.length}</p>
                <p className="text-xs text-white/70 mt-0.5">Formations</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-white/70 mt-0.5">Langues</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">DQP</p>
                <p className="text-xs text-white/70 mt-0.5">Diplôme reconnu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Récap tarifaire ── */}
      <section className="bg-muted border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Formations Générales</p>
                <p className="font-bold text-primary">350 000 FCFA</p>
                <p className="text-xs text-muted-foreground">+ 25 000 inscription</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Monitor className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Formations Informatiques</p>
                <p className="font-bold text-accent">400 000 FCFA</p>
                <p className="text-xs text-muted-foreground">+ 25 000 inscription</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Courte Durée / Langues</p>
                <p className="font-bold text-secondary">À partir de 35 000 FCFA</p>
                <p className="text-xs text-muted-foreground">Inscription variable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Liste des formations ── */}
      <section className="py-12">
        <div className="container mx-auto px-4">

          {/* Filtres de catégorie */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                  ${selectedCategory === cat.value
                    ? "bg-primary text-white border-primary shadow-md scale-105"
                    : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                  }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === cat.value ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Structure info banner — formations 12 mois */}
          {(selectedCategory === "all" || selectedCategory === "generales" || selectedCategory === "info-generales" || selectedCategory === "informatique") && (
            <div className="mb-8 p-5 bg-white rounded-2xl border shadow-sm max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-primary text-sm">Structure des Formations 12 mois</h3>
                <span className="ml-auto text-xs text-muted-foreground">Option courte : 4 mois → Attestation</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {[
                  { label: "Tronc commun", duration: "3 mois" },
                  { label: "Spécialité", duration: "3 mois" },
                  { label: "Stage entreprise", duration: "2 mois" },
                  { label: "Rédaction mémoire", duration: "2 mois" },
                  { label: "Rattrapage", duration: "1 mois" },
                  { label: "Examen final", duration: "1 mois" },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-2 rounded-lg bg-muted">
                    <span className="text-xs font-bold text-primary">{step.duration}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{step.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Award className="h-3.5 w-3.5 text-accent shrink-0" />
                Diplôme délivré : <span className="font-semibold text-primary">DQP (Diplôme de Qualification Professionnelle)</span> ou <span className="font-semibold text-primary">CQP (Certificat de Qualification Professionnelle)</span>
              </div>
            </div>
          )}

          {/* Structure info banner — courte durée */}
          {selectedCategory === "courte" && (
            <div className="mb-8 p-5 bg-white rounded-2xl border shadow-sm max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-primary text-sm">Structure des Formations Courte Durée</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <BookOpen className="h-4 w-4 text-accent shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">2 mois</p>
                    <p className="text-xs text-muted-foreground">Cours théoriques et pratiques</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Briefcase className="h-4 w-4 text-accent shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">1 mois</p>
                    <p className="text-xs text-muted-foreground">Stage pratique</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grille de formations */}
          {/* Grouper par sous-catégorie si "all" */}
          {selectedCategory === "all" ? (
            <div className="space-y-12">
              <FormationGroup
                title="Formations Générales"
                subtitle="350 000 FCFA · 12 mois · Inscription : 25 000 FCFA"
                icon={BookMarked}
                formations={formationsGenerales}
              />
              <FormationGroup
                title="Informatique & Gestion"
                subtitle="350 000 FCFA · 12 mois · Inscription : 25 000 FCFA"
                icon={Monitor}
                formations={formationsInfoGenerales}
              />
              <FormationGroup
                title="Informatique Pure"
                subtitle="400 000 FCFA · 12 mois · Inscription : 25 000 FCFA"
                icon={Code}
                formations={formationsInfo}
              />
              <FormationGroup
                title="Courte Durée"
                subtitle="Langues & Auto-École · Durée variable"
                icon={Clock}
                formations={formations3Mois}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFormations.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Besoin de Plus d'Informations ?</h2>
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

// ── Groupe de formations avec titre de section ──────────────────────────────
function FormationGroup({ title, subtitle, icon: Icon, formations }: {
  title: string;
  subtitle: string;
  icon: any;
  formations: any[];
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-primary">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="ml-auto h-px flex-1 bg-border max-w-xs hidden sm:block" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formations.map((formation) => (
          <FormationCard key={formation.id} formation={formation} />
        ))}
      </div>
    </div>
  );
}

// ── Carte formation ──────────────────────────────────────────────────────────
function FormationCard({ formation }: { formation: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="relative h-44">
        <ImageWithFallback
          src={formation.image}
          alt={formation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Durée badge */}
        <Badge className="absolute top-3 right-3 bg-accent text-white text-xs">
          {formation.duration}
        </Badge>
        {/* Option courte badge */}
        {formation.shortDuration && (
          <Badge className="absolute top-3 left-3 bg-primary/80 text-white text-xs backdrop-blur-sm">
            ou {formation.shortDuration}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <formation.icon className="h-4 w-4 text-accent flex-shrink-0" />
          <span className="line-clamp-1">{formation.title}</span>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {formation.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {/* Niveau requis */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> Niveau requis
            </span>
            <span className="font-semibold text-primary text-right max-w-[55%]">{formation.level}</span>
          </div>
          {/* Prix */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Frais de formation</span>
            <span className="font-bold text-accent">{formation.price}</span>
          </div>
          {/* Inscription */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Inscription</span>
            <span className="font-semibold text-muted-foreground">{formation.inscription}</span>
          </div>
          {/* Diplôme */}
          {formation.diplome && (
            <div className="flex items-center gap-1.5 text-xs bg-muted rounded-md px-2 py-1.5">
              <Award className="h-3 w-3 text-accent shrink-0" />
              <span className="text-muted-foreground">{formation.diplome}</span>
            </div>
          )}
          {/* Langues badges */}
          {formation.languages && (
            <div className="flex flex-wrap gap-1 pt-1">
              {formation.languages.slice(0, 3).map((lang: string) => (
                <Badge key={lang} variant="secondary" className="text-xs px-1.5 py-0.5">
                  {lang}
                </Badge>
              ))}
              {formation.languages.length > 3 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  +{formation.languages.length - 3}
                </Badge>
              )}
            </div>
          )}
          {/* Frais examen auto-école */}
          {formation.examFee && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Frais d'examen</span>
              <span className="font-semibold text-muted-foreground">{formation.examFee}</span>
            </div>
          )}
          <Link to={`/formations/${formation.id}`}>
            <Button className="w-full bg-primary hover:bg-primary/90 mt-1 h-9 text-sm">
              Voir détails
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}