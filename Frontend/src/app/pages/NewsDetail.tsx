import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CalendarDays, Clock, ArrowLeft, Globe2, Share2, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { apiUrl } from "../lib/api";

type NewsItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  time?: string;
  excerpt: string;
  description?: string;
  highlight?: string;
  validity?: string;
  image?: string;
  video?: string;
  published_at?: string;
};

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await fetch(apiUrl(`/api/news/${id}`), {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement de l'actualité");
        }

        const data = await response.json();
        
        const published = data.published_at ? new Date(data.published_at) : null;
        const formattedDate = published
          ? published.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "";

        const formattedTime = published
          ? published.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : undefined;

        setNews({
          ...data,
          date: formattedDate,
          time: formattedTime,
          image: data.image,
          video: data.video,
        });
      } catch (error) {
        console.error("Erreur lors du chargement de l'actualité:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const shareNews = async () => {
    if (news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback: copier dans le presse-papiers
        navigator.clipboard.writeText(window.location.href);
        console.log("Lien copié dans le presse-papiers");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#1e3a8a] border-t-transparent animate-spin" />
          <p className="text-[#64748b] text-sm tracking-wide">Chargement de l'actualité…</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#64748b]">Actualité non trouvée.</p>
          <Link to="/news">
            <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux actualités
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9]">

      {/* ── Hero Header ── */}
      <section className="relative bg-[#1e3a8a] overflow-hidden">
        {/* subtle diagonal accent stripe */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #3b82f6 0px, #3b82f6 1px, transparent 1px, transparent 60px)",
          }}
        />
        {/* orange accent bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f97316]" />

        <div className="relative container mx-auto px-4 py-14">
          <div className="max-w-4xl mx-auto">

            {/* Back link */}
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-8 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux actualités
            </Link>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f97316] text-white tracking-wide uppercase">
                {news.category}
              </span>

              <span className="inline-flex items-center gap-1.5 text-white/60 text-sm">
                <CalendarDays className="h-3.5 w-3.5" />
                {news.date || "Date à venir"}
              </span>

              {news.time && (
                <span className="inline-flex items-center gap-1.5 text-white/60 text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {news.time}
                </span>
              )}

              {news.validity && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-white/20 text-white/70">
                  {news.validity}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              {news.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base text-white/75 leading-relaxed max-w-2xl">
              {news.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── Main column ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Media card */}
                {(news.image || news.video) && (
                  <div className="rounded-2xl overflow-hidden shadow-sm bg-white">
                    <div className="relative aspect-video">
                      {news.video ? (
                        <div className="relative w-full h-full">
                          <video
                            ref={videoRef}
                            src={news.video}
                            className="w-full h-full object-cover"
                            muted={isMuted}
                            loop
                            playsInline
                          />
                          {/* Video controls overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-start p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={togglePlay}
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1e3a8a] transition-colors duration-150 shadow"
                              >
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={toggleMute}
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1e3a8a] transition-colors duration-150 shadow"
                              >
                                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : news.image ? (
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Description card */}
                <div className="rounded-2xl bg-white shadow-sm p-8">
                  <h2 className="text-lg font-semibold text-[#1e3a8a] mb-5 pb-3 border-b border-[#f1f5f9]">
                    Détails de l'actualité
                  </h2>
                  <div className="prose prose-slate max-w-none text-[#1a1a1a] leading-relaxed">
                    {news.description ? (
                      <div dangerouslySetInnerHTML={{ __html: news.description }} />
                    ) : (
                      <p className="text-[#64748b]">{news.excerpt}</p>
                    )}
                  </div>

                  {news.highlight && (
                    <div className="mt-7 flex gap-4 p-5 rounded-xl bg-[#fff7ed] border-l-4 border-[#f97316]">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#f97316] uppercase tracking-wider mb-1">Point clé</p>
                        <p className="text-sm text-[#1a1a1a] leading-relaxed">{news.highlight}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions card */}
                <div className="rounded-2xl bg-white shadow-sm p-6 flex flex-wrap gap-3">
                  <button
                    onClick={shareNews}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#1e3a8a]/20 text-[#1e3a8a] text-sm font-medium hover:bg-[#1e3a8a]/5 transition-colors duration-150"
                  >
                    <Share2 className="h-4 w-4" />
                    Partager
                  </button>
                  <Link to="/contact">
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a8a] text-white text-sm font-medium hover:bg-[#1e3a8a]/90 transition-colors duration-150">
                      Nous contacter
                    </button>
                  </Link>
                </div>
              </div>

              {/* ── Sidebar ── */}
              <div className="space-y-5">

                {/* Quick Info */}
                <div className="rounded-2xl bg-white shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wider mb-4">
                    Informations
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[#64748b] mb-1.5">Catégorie</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f97316]/10 text-[#f97316]">
                        {news.category}
                      </span>
                    </div>
                    <div className="border-t border-[#f1f5f9] pt-4">
                      <p className="text-xs text-[#64748b] mb-1">Date de publication</p>
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        {news.date || "Date à venir"}
                      </p>
                    </div>
                    {news.validity && (
                      <div className="border-t border-[#f1f5f9] pt-4">
                        <p className="text-xs text-[#64748b] mb-1">Validité</p>
                        <p className="text-sm font-medium text-[#1a1a1a]">{news.validity}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Related Actions */}
                <div className="rounded-2xl bg-white shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wider mb-4">
                    Actions
                  </h3>
                  <div className="space-y-2">
                    <Link to="/contact" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-[#1e3a8a] font-medium border border-[#1e3a8a]/10 hover:bg-[#1e3a8a]/5 transition-colors duration-150">
                      <Globe2 className="h-4 w-4 text-[#3b82f6] shrink-0" />
                      Demander plus d'informations
                    </Link>
                    <Link to="/formations" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-[#1e3a8a] font-medium border border-[#1e3a8a]/10 hover:bg-[#1e3a8a]/5 transition-colors duration-150">
                      Voir nos formations
                    </Link>
                    <Link to="/services-internationaux" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-[#1e3a8a] font-medium border border-[#1e3a8a]/10 hover:bg-[#1e3a8a]/5 transition-colors duration-150">
                      Services internationaux
                    </Link>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-[#1e3a8a] px-6 pt-6 pb-5">
                    <h3 className="text-sm font-semibold text-white mb-1">Restez informé</h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Recevez les dernières actualités directement dans votre boîte mail.
                    </p>
                  </div>
                  <div className="bg-white px-6 py-4">
                    <Link to="/contact">
                      <button className="w-full py-2.5 rounded-lg bg-[#f97316] hover:bg-[#f97316]/90 text-white text-sm font-semibold transition-colors duration-150">
                        S'inscrire à la newsletter
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
