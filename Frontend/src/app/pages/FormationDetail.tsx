import { useParams, Link } from "react-router";
import {
  Clock,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  GraduationCap,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { formationsDetail } from "../data/formationsDetail";

export default function FormationDetail() {
  const { id } = useParams();
  const numericId = Number(id);
  const formation = formationsDetail.find((f) => f.id === numericId);

  if (!formation) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#64748b]">
            Cette formation n'existe pas ou n'a pas encore de page de détail configurée.
          </p>
          <Link to="/formations">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a8a] text-white text-sm font-medium hover:bg-[#1e3a8a]/90 transition-colors duration-150">
              <ArrowLeft className="h-4 w-4" />
              Retour aux formations
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Déterminer la durée réelle et le prix selon la catégorie
  const isCourteDuree = formation.id === 101 || formation.id === 102;
  const isInfoPure = [12, 14, 15].includes(formation.id);

  const prixFormation = isCourteDuree
    ? formation.price
    : isInfoPure
    ? "400 000 FCFA"
    : "350 000 FCFA";

  const dureeFormation = isCourteDuree ? formation.duration : "12 mois";
  const dureeOption = isCourteDuree ? null : "4 mois (attestation)";

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9]">

      {/* ── Hero Header ── */}
      <section className="relative bg-[#1e3a8a] overflow-hidden">
        {/* subtle diagonal stripe */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #3b82f6 0px, #3b82f6 1px, transparent 1px, transparent 60px)",
          }}
        />
        {/* orange accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f97316]" />

        <div className="relative container mx-auto px-4 py-14">
          <div className="max-w-5xl mx-auto">
            {/* Back link */}
            <Link
              to="/formations"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-8 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux formations
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left: text */}
              <div>
                {/* Category pill */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f97316] text-white tracking-wide uppercase mb-5">
                  {formation.category}
                </span>

                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                  {formation.title}
                </h1>

                <p className="text-base text-white/75 leading-relaxed mb-8">
                  {formation.description}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Durée principale */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 shrink-0">
                      <Clock className="h-4 w-4 text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-0.5">Durée</p>
                      <p className="text-sm font-semibold text-white">{dureeFormation}</p>
                      {dureeOption && (
                        <p className="text-xs text-white/50">ou {dureeOption}</p>
                      )}
                    </div>
                  </div>

                  {/* Niveau */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 shrink-0">
                      <GraduationCap className="h-4 w-4 text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-0.5">Niveau requis</p>
                      <p className="text-sm font-semibold text-white">{formation.level}</p>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 shrink-0">
                      <DollarSign className="h-4 w-4 text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-0.5">Frais de formation</p>
                      <p className="text-sm font-semibold text-white">{prixFormation}</p>
                      {!isCourteDuree && (
                        <p className="text-xs text-white/50">+ 25 000 FCFA inscription</p>
                      )}
                    </div>
                  </div>

                  {/* Prochaine session */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 shrink-0">
                      <Calendar className="h-4 w-4 text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-0.5">Prochaine session</p>
                      <p className="text-sm font-semibold text-white">Avril 2026</p>
                    </div>
                  </div>
                </div>

                <Link to="/contact">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#f97316] hover:bg-[#f97316]/90 text-white text-sm font-semibold transition-colors duration-150">
                    S'inscrire Maintenant
                  </button>
                </Link>
              </div>

              {/* Right: image */}
              <div className="hidden lg:block">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={formation.image}
                    alt={formation.title}
                    className="w-full h-72 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── Main column ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Objectifs */}
                <div className="rounded-2xl bg-white shadow-sm p-8">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#f1f5f9]">
                    <CheckCircle className="h-5 w-5 text-[#f97316] shrink-0" />
                    <h2 className="text-lg font-semibold text-[#1e3a8a]">Objectifs de la Formation</h2>
                  </div>
                  <ul className="space-y-3">
                    {formation.objectifs.map((objectif: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f97316]/10 shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-[#f97316]" />
                        </span>
                        <span className="text-sm text-[#1a1a1a] leading-relaxed">{objectif}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Programme */}
                <div className="rounded-2xl bg-white shadow-sm p-8">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#f1f5f9]">
                    <BookOpen className="h-5 w-5 text-[#f97316] shrink-0" />
                    <h2 className="text-lg font-semibold text-[#1e3a8a]">Programme de Formation</h2>
                  </div>
                  <div className="space-y-6">
                    {formation.programme.map((phase: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1e3a8a] text-white text-xs font-bold shrink-0">
                            {index + 1}
                          </span>
                          <h4 className="font-semibold text-[#1e3a8a] text-sm">{phase.phase}</h4>
                        </div>
                        <ul className="ml-8 space-y-2">
                          {phase.modules.map((module: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shrink-0 mt-2" />
                              <span className="text-sm text-[#64748b] leading-relaxed">{module}</span>
                            </li>
                          ))}
                        </ul>
                        {index < formation.programme.length - 1 && (
                          <div className="ml-3 mt-4 border-l-2 border-dashed border-[#f1f5f9] h-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Débouchés */}
                <div className="rounded-2xl bg-white shadow-sm p-8">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#f1f5f9]">
                    <Briefcase className="h-5 w-5 text-[#f97316] shrink-0" />
                    <h2 className="text-lg font-semibold text-[#1e3a8a]">Débouchés Professionnels</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formation.debouches.map((debouche: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-[#1e3a8a]/5 text-[#1e3a8a] border border-[#1e3a8a]/10"
                      >
                        {debouche}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Sidebar ── */}
              <div className="space-y-5">

                {/* Conditions d'admission */}
                <div className="rounded-2xl bg-white shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-[#f97316] shrink-0" />
                    <h3 className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wider">
                      Conditions d'Admission
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {formation.prerequis.map((prerequis: string, index: number) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <CheckCircle className="h-4 w-4 text-[#f97316] shrink-0 mt-0.5" />
                        <span className="text-sm text-[#1a1a1a] leading-relaxed">{prerequis}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Récap tarifaire */}
                <div className="rounded-2xl bg-white shadow-sm p-6 border border-[#f97316]/20">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-4 w-4 text-[#f97316] shrink-0" />
                    <h3 className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wider">
                      Récap Tarifaire
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#64748b]">Frais de formation</span>
                      <span className="font-bold text-[#f97316]">{prixFormation}</span>
                    </div>
                    {!isCourteDuree && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#64748b]">Inscription</span>
                        <span className="font-semibold text-[#1e3a8a]">25 000 FCFA</span>
                      </div>
                    )}
                    {formation.examFee && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#64748b]">Frais d'examen</span>
                        <span className="font-semibold text-[#1e3a8a]">{formation.examFee}</span>
                      </div>
                    )}
                    {!isCourteDuree && (
                      <div className="pt-2 border-t border-[#f1f5f9]">
                        <p className="text-xs text-[#64748b]">
                          Option courte : <span className="font-semibold text-[#1e3a8a]">4 mois</span> → Attestation de fin de formation
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations pratiques */}
                <div className="rounded-2xl bg-[#1e3a8a] p-6">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    Informations Pratiques
                  </h3>
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <p className="text-xs text-white/50 mb-1">Horaires</p>
                      <p className="text-sm font-semibold text-white">Cours du jour et du soir</p>
                    </div>
                    <div className="border-b border-white/10 pb-3">
                      <p className="text-xs text-white/50 mb-1">Certification</p>
                      <p className="text-sm font-semibold text-white">
                        {isCourteDuree ? "Attestation de fin de formation" : "DQP / CQP reconnu"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-1">Effectif</p>
                      <p className="text-sm font-semibold text-white">Maximum 20 étudiants/classe</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-[#f97316] px-6 pt-6 pb-5">
                    <h3 className="text-sm font-semibold text-white mb-1">Prêt à Commencer ?</h3>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Inscrivez-vous dès maintenant ou contactez-nous pour plus d'informations.
                    </p>
                  </div>
                  <div className="bg-white px-6 py-4 space-y-2">
                    <Link to="/contact">
                      <button className="w-full py-2.5 rounded-lg bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white text-sm font-semibold transition-colors duration-150">
                        S'inscrire Maintenant
                      </button>
                    </Link>
                    <Link to="/contact">
                      <button className="w-full py-2.5 rounded-lg border border-[#1e3a8a]/20 text-[#1e3a8a] text-sm font-medium hover:bg-[#1e3a8a]/5 transition-colors duration-150">
                        Nous Contacter
                      </button>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}