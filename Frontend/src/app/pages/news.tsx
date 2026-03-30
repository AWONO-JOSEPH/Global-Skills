import { useEffect, useState, useRef, RefObject } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { CalendarDays, Clock, ArrowRight, Newspaper, Globe2, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { apiUrl, apiFetch } from "../lib/api";

type NewsItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  time?: string;
  excerpt: string;
  highlight?: string;
  validity?: string;
  image?: string;
  video?: string;
};

export default function News() {
  const { toast } = useToast();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState<{ [key: number]: boolean }>({});
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});

  const toggleMute = (itemId: number) => {
    setIsMuted(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    if (videoRefs.current[itemId]) {
      videoRefs.current[itemId]!.muted = !videoRefs.current[itemId]!.muted;
    }
    if (audioRefs.current[itemId]) {
      audioRefs.current[itemId]!.muted = !audioRefs.current[itemId]!.muted;
    }
  };

  const togglePlay = (itemId: number) => {
    setIsPlaying(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    if (videoRefs.current[itemId]) {
      if (isPlaying[itemId]) {
        videoRefs.current[itemId]!.pause();
      } else {
        videoRefs.current[itemId]!.play();
      }
    }
    if (audioRefs.current[itemId]) {
      if (isPlaying[itemId]) {
        audioRefs.current[itemId]!.pause();
      } else {
        audioRefs.current[itemId]!.play();
      }
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch("/api/news");

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des actualités");
        }

        const data: Array<{
          id: number;
          title: string;
          description: string;
          category: string;
          published_at?: string;
          image?: string;
          video?: string;
        }> = await response.json();

        const mapped: NewsItem[] = data.map((item) => {
          const published = item.published_at ? new Date(item.published_at) : null;
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

          return {
            id: item.id,
            title: item.title,
            category: item.category,
            date: formattedDate,
            time: formattedTime,
            excerpt: item.description,
            validity: "Actualité récente",
            image: item.image,
            video: item.video,
          };
        });

        setItems(mapped);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les actualités.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Actualités & Événements
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Restez informé des dernières nouvelles, événements, partenariats et opportunités
              proposés par Global Skills.
            </p>
          </div>
        </div>
      </section>

      {/* News List Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Les Dernières Nouvelles
            </h2>
            <p className="text-muted-foreground">
              Découvrez ce qui se passe actuellement dans notre institut de formation :
              nouvelles promotions, partenariats, événements et mises à jour de programmes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && items.length === 0 && (
              <div className="col-span-full text-center">
                <p className="text-muted-foreground">
                  Chargement des actualités...
                </p>
              </div>
            )}
            {!isLoading && items.length === 0 && (
              <div className="col-span-full text-center">
                <p className="text-muted-foreground">
                  Aucune actualité disponible pour le moment.
                </p>
              </div>
            )}
            {items.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border-0 shadow-lg hover:scale-105"
                style={{ minHeight: '400px' }}
              >
                {/* Media Section */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  {item.video ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={(el: HTMLVideoElement | null) => { videoRefs.current[item.id] = el }}
                        src={item.video}
                        className="w-full h-full object-cover"
                        muted={isMuted[item.id] || false}
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => togglePlay(item.id)}
                            className="bg-white/90 hover:bg-white"
                          >
                            {isPlaying[item.id] ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleMute(item.id)}
                            className="bg-white/90 hover:bg-white"
                          >
                            {isMuted[item.id] ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        console.warn('Image failed to load:', item.image);
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', item.image);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Newspaper className="h-16 w-16 text-accent/70" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <CardContent className="p-6 flex-1">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-4 w-4 text-accent" />
                            {item.date || "Date à venir"}
                          </span>
                          {item.time && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-4 w-4 text-accent" />
                              {item.time}
                            </span>
                          )}
                          {item.validity && (
                            <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent border-accent/20">
                              {item.validity}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs whitespace-nowrap">
                          {item.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {item.excerpt}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-auto">
                      <Link to={`/news/${item.id}`}>
                        <Button variant="outline" size="sm" className="text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          En savoir plus
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="ghost" size="sm" className="text-sm">
                          Nous Contacter
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Info / CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-primary">
                Restez Informé
              </h2>
              <p className="text-muted-foreground mb-4">
                Les actualités de Global Skills vous permettent de suivre l’évolution
                de nos programmes, de découvrir les nouvelles opportunités de stage
                et d’emploi, ainsi que nos collaborations nationales et internationales.
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Nouvelles promotions et dates de rentrée.</li>
                <li>• Séminaires, ateliers et journées portes ouvertes.</li>
                <li>• Partenariats avec entreprises et universités.</li>
                <li>• Témoignages et succès de nos apprenants.</li>
              </ul>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Newspaper className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Envoyez-nous vos Informations
                      </CardTitle>
                      <CardDescription>
                        Vous organisez un événement lié à Global Skills ?
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Partenaires, anciens étudiants ou entreprises : partagez vos événements
                    et opportunités afin qu’ils puissent être mis en avant dans nos actualités.
                  </p>
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

      {/* Optional: Section info internationale */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="border-dashed">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Globe2 className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  Suivez aussi nos actualités internationales
                </h3>
                <p className="text-sm text-muted-foreground">
                  Découvrez les informations liées aux programmes d’études à l’étranger,
                  aux bourses disponibles et aux retours d’expérience de nos étudiants internationaux.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
