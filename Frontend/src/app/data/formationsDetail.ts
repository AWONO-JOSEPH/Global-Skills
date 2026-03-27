export type FormationPhase = {
  phase: string;
  modules: string[];
};

export type FormationDetailItem = {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: string;
  level: string;
  image: string;
  description: string;
  objectifs: string[];
  programme: FormationPhase[];
  prerequis: string[];
  debouches: string[];
};

const IMG_PRO =
  "https://images.unsplash.com/photo-1761250246894-ee2314939662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MjU0OTY5OXww&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_DIGITAL =
  "https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nJTIwZGlnaXRhbCUyMHNraWxsc3xlbnwxfHx8fDE3NzI1MzAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_LANG =
  "https://images.unsplash.com/photo-1558443957-d056622df610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGxlYXJuaW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3MjUzMDE0Nnww&ixlib=rb-4.1.0&q=80&w=1080";
const IMG_CAR =
  "https://images.unsplash.com/photo-1764547169175-9b7d2736324e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcml2aW5nJTIwc2Nob29sJTIwaW5zdHJ1Y3RvcnxlbnwxfHx8fDE3NzI2MTU2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080";

const TRONC_COMMUN: FormationPhase = {
  phase: "Tronc Commun (3 mois)",
  modules: [
    "Bureautique et outils professionnels",
    "Communication professionnelle",
    "Gestion du temps et organisation",
    "Introduction à la spécialité",
  ],
};

const STAGE: FormationPhase = {
  phase: "Stage en Entreprise (2 mois)",
  modules: [
    "Application pratique en entreprise",
    "Gestion de projets réels",
    "Encadrement professionnel",
  ],
};

const MEMOIRE: FormationPhase = {
  phase: "Mémoire et Examen (6 mois)",
  modules: [
    "Rédaction du mémoire professionnel",
    "Période de rattrapage",
    "Examen final et certification",
  ],
};

export const formationsDetail: FormationDetailItem[] = [
  {
    id: 1,
    title: "QHSE",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Maîtrisez les systèmes de management Qualité, Hygiène, Sécurité et Environnement pour garantir la conformité et la performance des organisations.",
    objectifs: [
      "Comprendre les normes ISO 9001, 14001 et 45001",
      "Mettre en place un système de management intégré",
      "Réaliser des audits internes et des inspections",
      "Gérer les risques professionnels et environnementaux",
      "Rédiger des procédures et des plans d'action",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Normes ISO et référentiels QHSE",
          "Gestion des risques professionnels",
          "Audit interne et contrôle qualité",
          "Environnement et développement durable",
          "Hygiène industrielle et sécurité au travail",
          "Rédaction de procédures et rapports",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Intérêt pour la sécurité et l'environnement",
      "Motivation et rigueur",
    ],
    debouches: [
      "Responsable QHSE",
      "Auditeur qualité",
      "Chargé de sécurité",
      "Coordinateur environnement",
      "Inspecteur HSE",
    ],
  },
  {
    id: 2,
    title: "Douane et Transit",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Acquérez les compétences nécessaires pour gérer les opérations douanières, le transit international et la réglementation du commerce extérieur.",
    objectifs: [
      "Maîtriser la réglementation douanière nationale et internationale",
      "Gérer les formalités d'importation et d'exportation",
      "Utiliser les outils informatiques douaniers",
      "Optimiser les coûts logistiques et douaniers",
      "Assurer la conformité réglementaire des opérations",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Réglementation douanière",
          "Procédures d'importation et d'exportation",
          "Incoterms et contrats internationaux",
          "Tarification douanière",
          "Logistique internationale",
          "Outils informatiques douaniers",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Intérêt pour le commerce international",
      "Sens de l'organisation",
    ],
    debouches: [
      "Agent en douane",
      "Transitaire",
      "Déclarant en douane",
      "Responsable import/export",
      "Commissionnaire en douane",
    ],
  },
  {
    id: 3,
    title: "Logistique et Transport",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Formez-vous à la gestion de la chaîne logistique, du transport de marchandises et de l'optimisation des flux pour les entreprises.",
    objectifs: [
      "Maîtriser les fondamentaux de la supply chain",
      "Gérer les stocks et les entrepôts",
      "Planifier et optimiser les transports",
      "Utiliser les outils de gestion logistique",
      "Réduire les coûts et améliorer les délais",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Gestion des stocks et entrepôts",
          "Transport routier, maritime et aérien",
          "Supply chain management",
          "Outils ERP et WMS",
          "Planification et optimisation des flux",
          "Gestion des fournisseurs",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Sens de l'organisation et de la rigueur",
      "Aptitude à travailler en équipe",
    ],
    debouches: [
      "Responsable logistique",
      "Gestionnaire de stock",
      "Coordinateur transport",
      "Agent de fret",
      "Responsable supply chain",
    ],
  },
  {
    id: 4,
    title: "Entrepreneuriat",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Développez les compétences essentielles pour créer, lancer et gérer votre propre entreprise avec succès.",
    objectifs: [
      "Élaborer un business plan solide",
      "Comprendre les aspects juridiques et fiscaux de la création d'entreprise",
      "Maîtriser les bases de la gestion financière",
      "Développer une stratégie marketing efficace",
      "Gérer une équipe et piloter la croissance",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Idéation et validation de projet",
          "Business plan et modèle économique",
          "Aspects juridiques de la création",
          "Financement et levée de fonds",
          "Marketing et développement commercial",
          "Gestion financière de base",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Esprit d'initiative et créativité",
      "Motivation entrepreneuriale",
    ],
    debouches: [
      "Entrepreneur / Créateur d'entreprise",
      "Chef de projet",
      "Consultant en développement d'entreprise",
      "Responsable commercial",
      "Manager de PME",
    ],
  },
  {
    id: 5,
    title: "Gestion des Projets",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Maîtrisez les méthodes et outils de gestion de projets pour planifier, exécuter et livrer des projets dans les délais et budgets impartis.",
    objectifs: [
      "Appliquer les méthodologies de gestion de projet (PMI, Agile, Scrum)",
      "Planifier et estimer les ressources et les coûts",
      "Gérer les risques et les parties prenantes",
      "Utiliser les outils de gestion de projet (MS Project, Trello, Jira)",
      "Assurer le suivi et le reporting de projet",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Fondamentaux du management de projet",
          "Planification et ordonnancement",
          "Gestion des risques",
          "Méthodes Agile et Scrum",
          "Outils de gestion de projet",
          "Communication et leadership",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Sens de l'organisation",
      "Aptitude au leadership",
    ],
    debouches: [
      "Chef de projet",
      "Project Manager",
      "Coordinateur de projet",
      "Scrum Master",
      "Responsable PMO",
    ],
  },
  {
    id: 6,
    title: "Comptabilité Informatisée",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Maîtrisez la comptabilité générale et analytique avec les logiciels spécialisés utilisés par les entreprises modernes.",
    objectifs: [
      "Maîtriser les principes de la comptabilité générale",
      "Utiliser les logiciels comptables (Sage, QuickBooks)",
      "Établir les états financiers",
      "Gérer la paie et les déclarations sociales",
      "Analyser les performances financières",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Comptabilité générale et analytique",
          "Logiciels comptables (Sage, etc.)",
          "Gestion de la paie",
          "États financiers et bilans",
          "Déclarations fiscales et sociales",
          "Contrôle de gestion",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Aptitude pour les chiffres",
      "Rigueur et précision",
    ],
    debouches: [
      "Comptable",
      "Assistant comptable",
      "Gestionnaire de paie",
      "Aide-comptable",
      "Contrôleur de gestion junior",
    ],
  },
  {
    id: 7,
    title: "Fiscalité",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Acquérez une expertise en droit fiscal, gestion des impôts et déclarations fiscales pour accompagner les entreprises dans leurs obligations.",
    objectifs: [
      "Comprendre le système fiscal national",
      "Maîtriser les différents impôts et taxes",
      "Établir les déclarations fiscales",
      "Optimiser la charge fiscale des entreprises",
      "Assurer la veille réglementaire fiscale",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Droit fiscal général",
          "Impôt sur les sociétés et l'IR",
          "TVA et taxes indirectes",
          "Déclarations et obligations fiscales",
          "Optimisation fiscale",
          "Contrôle fiscal et contentieux",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Intérêt pour le droit et la finance",
      "Rigueur et sens du détail",
    ],
    debouches: [
      "Conseiller fiscal",
      "Assistant fiscal",
      "Gestionnaire fiscal en entreprise",
      "Collaborateur en cabinet comptable",
      "Responsable fiscal",
    ],
  },
  {
    id: 8,
    title: "Marketing Digital",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_DIGITAL,
    description:
      "Maîtrisez les stratégies et outils du marketing digital pour développer la présence en ligne des entreprises et booster leur croissance.",
    objectifs: [
      "Comprendre les fondamentaux du marketing digital",
      "Maîtriser les réseaux sociaux professionnels",
      "Créer et gérer des campagnes publicitaires en ligne",
      "Analyser les performances et optimiser les stratégies",
      "Développer une présence digitale efficace",
    ],
    programme: [
      {
        phase: "Tronc Commun (3 mois)",
        modules: [
          "Introduction au marketing digital",
          "Outils bureautiques professionnels",
          "Communication digitale",
          "Gestion de projet",
        ],
      },
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "SEO et référencement naturel",
          "Social Media Marketing",
          "Google Ads et publicité en ligne",
          "Email Marketing",
          "Analytics et mesure de performance",
          "Content Marketing",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Maîtrise de base de l'outil informatique",
      "Motivation et engagement",
    ],
    debouches: [
      "Community Manager",
      "Chef de projet digital",
      "Consultant en marketing digital",
      "Traffic Manager",
      "Content Manager",
      "Entrepreneur digital",
    ],
  },
  {
    id: 9,
    title: "Secrétariat Bureautique",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Formez-vous aux métiers du secrétariat et de la bureautique pour assurer la gestion administrative et organisationnelle des entreprises.",
    objectifs: [
      "Maîtriser les outils bureautiques (Word, Excel, PowerPoint)",
      "Gérer la correspondance et les communications professionnelles",
      "Organiser les agendas et les réunions",
      "Classer et archiver les documents",
      "Accueillir et orienter les visiteurs",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Traitement de texte avancé",
          "Tableur et bases de données",
          "Gestion de l'agenda et des réunions",
          "Correspondance professionnelle",
          "Accueil et communication",
          "Archivage et gestion documentaire",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Bonne maîtrise du français écrit",
      "Sens de l'organisation",
    ],
    debouches: [
      "Secrétaire bureautique",
      "Assistant administratif",
      "Agent de saisie",
      "Réceptionniste",
      "Gestionnaire de documents",
    ],
  },
  {
    id: 10,
    title: "Secrétariat Comptable",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Combinez les compétences de secrétariat et de comptabilité pour assurer la gestion administrative et financière des entreprises.",
    objectifs: [
      "Maîtriser les outils bureautiques et comptables",
      "Gérer la saisie comptable et les factures",
      "Assurer le suivi des paiements et relances",
      "Préparer les déclarations fiscales de base",
      "Gérer la correspondance administrative et financière",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Comptabilité générale de base",
          "Saisie comptable et facturation",
          "Gestion des paiements et relances",
          "Déclarations fiscales simples",
          "Bureautique avancée",
          "Correspondance financière",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Aptitude pour les chiffres",
      "Rigueur et organisation",
    ],
    debouches: [
      "Secrétaire comptable",
      "Assistant comptable",
      "Agent de facturation",
      "Aide-comptable",
      "Gestionnaire administratif et financier",
    ],
  },
  {
    id: 11,
    title: "Secrétariat de Direction",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_PRO,
    description:
      "Devenez un assistant de direction efficace, capable de gérer les activités d'un dirigeant et de coordonner les équipes.",
    objectifs: [
      "Assister un dirigeant dans ses activités quotidiennes",
      "Gérer les agendas complexes et les déplacements",
      "Préparer et organiser les réunions de direction",
      "Rédiger des comptes rendus et rapports de direction",
      "Coordonner les équipes et les projets transversaux",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Gestion d'agenda et organisation de direction",
          "Rédaction professionnelle avancée",
          "Organisation de réunions et événements",
          "Gestion des déplacements professionnels",
          "Communication interne et externe",
          "Confidentialité et éthique professionnelle",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Excellente maîtrise du français",
      "Discrétion et sens des responsabilités",
    ],
    debouches: [
      "Assistant de direction",
      "Secrétaire de direction",
      "Office Manager",
      "Coordinateur administratif",
      "Assistant exécutif",
    ],
  },
  {
    id: 12,
    title: "Développeur d'Application",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_DIGITAL,
    description:
      "Apprenez à concevoir et développer des applications web et mobiles modernes adaptées aux besoins des entreprises.",
    objectifs: [
      "Maîtriser les langages de base du développement",
      "Comprendre les architectures web modernes",
      "Développer des APIs et interfaces utilisateur",
      "Assurer la qualité et la maintenance des applications",
    ],
    programme: [
      {
        phase: "Tronc Commun (3 mois)",
        modules: [
          "Algorithmique",
          "Bureautique",
          "Bases de la programmation",
          "Git & outils de travail collaboratif",
        ],
      },
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Développement front-end",
          "Développement back-end",
          "Bases de données",
          "Projet fil rouge",
        ],
      },
      {
        phase: "Stage en Entreprise (2 mois)",
        modules: [
          "Intégration en équipe",
          "Développement de fonctionnalités réelles",
        ],
      },
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Goût pour la logique et la résolution de problèmes",
    ],
    debouches: [
      "Développeur web",
      "Développeur mobile",
      "Intégrateur d'applications",
      "Technicien en développement",
    ],
  },
  {
    id: 13,
    title: "Graphisme de Production",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_DIGITAL,
    description:
      "Maîtrisez les outils de design graphique et de production visuelle pour créer des supports de communication percutants.",
    objectifs: [
      "Maîtriser les logiciels de design (Photoshop, Illustrator, InDesign)",
      "Créer des identités visuelles et chartes graphiques",
      "Concevoir des supports print et digitaux",
      "Comprendre les principes de la typographie et de la couleur",
      "Préparer les fichiers pour l'impression et le web",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Photoshop et retouche photo",
          "Illustrator et design vectoriel",
          "InDesign et mise en page",
          "Identité visuelle et branding",
          "Design web et UI",
          "Préparation à l'impression",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Sens artistique et créativité",
      "Maîtrise de base de l'informatique",
    ],
    debouches: [
      "Graphiste",
      "Designer graphique",
      "Maquettiste",
      "Directeur artistique junior",
      "Infographiste",
    ],
  },
  {
    id: 14,
    title: "Maintenance des Réseaux",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_DIGITAL,
    description:
      "Formez-vous à l'installation, la configuration et la maintenance des réseaux informatiques et des systèmes d'information.",
    objectifs: [
      "Comprendre les architectures réseau (LAN, WAN, Wi-Fi)",
      "Installer et configurer les équipements réseau",
      "Assurer la sécurité des réseaux",
      "Diagnostiquer et résoudre les pannes",
      "Administrer les serveurs et systèmes",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Fondamentaux des réseaux (TCP/IP, OSI)",
          "Configuration des routeurs et switches",
          "Sécurité réseau et pare-feu",
          "Administration Windows Server et Linux",
          "Wi-Fi et réseaux sans fil",
          "Diagnostic et dépannage réseau",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Intérêt pour l'informatique et les technologies",
      "Aptitude technique et logique",
    ],
    debouches: [
      "Technicien réseau",
      "Administrateur systèmes et réseaux",
      "Support informatique",
      "Technicien helpdesk",
      "Responsable infrastructure IT",
    ],
  },
  {
    id: 15,
    title: "Montage Audiovisuel",
    category: "Formation Professionnelle 12 mois",
    duration: "12 mois",
    price: "À partir de 150,000 FCFA",
    level: "baccalaureat/GCE A level",
    image: IMG_DIGITAL,
    description:
      "Maîtrisez les techniques de montage vidéo et de production audiovisuelle pour créer des contenus professionnels de qualité.",
    objectifs: [
      "Maîtriser les logiciels de montage (Premiere Pro, DaVinci Resolve)",
      "Comprendre les techniques de prise de vue et de son",
      "Réaliser des montages vidéo professionnels",
      "Créer des effets visuels et animations",
      "Produire des contenus pour le web et la télévision",
    ],
    programme: [
      TRONC_COMMUN,
      {
        phase: "Spécialité (3 mois)",
        modules: [
          "Techniques de prise de vue",
          "Prise de son et mixage audio",
          "Montage vidéo avec Premiere Pro",
          "Étalonnage et colorimétrie",
          "Motion design et effets visuels",
          "Production pour le web et les réseaux sociaux",
        ],
      },
      STAGE,
      MEMOIRE,
    ],
    prerequis: [
      "Niveau Baccalauréat ou équivalent",
      "Sens artistique et créativité",
      "Intérêt pour l'audiovisuel",
    ],
    debouches: [
      "Monteur vidéo",
      "Réalisateur",
      "Caméraman",
      "Motion designer",
      "Producteur de contenu digital",
    ],
  },
  {
    id: 101,
    title: "Langues Internationales",
    category: "Formation Courte Durée 12 mois",
    duration: "12 mois",
    price: "Voir détails par langue",
    level: "baccalaureat/GCE A level",
    image: IMG_LANG,
    description:
      "Perfectionnez votre niveau de langues étrangères pour booster votre carrière à l'international avec des certifications reconnues.",
    objectifs: [
      "Améliorer la compréhension orale et écrite",
      "Renforcer l'expression orale et la fluidité",
      "Acquérir le vocabulaire professionnel de base",
      "Préparer aux certifications internationales",
      "Communiquer efficacement dans un contexte professionnel",
    ],
    programme: [
      {
        phase: "🇩🇪 Allemand",
        modules: [
          "Niveaux A1 → C2 disponibles",
          "Inscription : 20 000 FCFA",
          "Prix par niveau :",
          "• A1 : 100 000 FCFA",
          "• A2 : 110 000 FCFA",
          "• B1 : 115 000 FCFA",
          "• B2 : 120 000 FCFA",
          "• C1 : 130 000 FCFA",
          "• C2 (Préparation) : 120 000 + 10 000 FCFA",
          "Certifications : GOETHE, ECL, ÖSD",
        ],
      },
      {
        phase: "🇬🇧 Anglais",
        modules: [
          "A1 (débutant) : 35 000 FCFA + 10 000 FCFA inscription",
          "Préparations aux certifications :",
          "• IELTS",
          "• TOEFL",
          "• TOEIC",
        ],
      },
      {
        phase: "🇸🇦 Arabe",
        modules: [
          "Programme : CIMA",
        ],
      },
      {
        phase: "🇨🇳 Chinois",
        modules: [
          "Programme : Mandarin",
        ],
      },
      {
        phase: "🇪🇸 Espagnol",
        modules: [
          "Niveaux A1 → C2 disponibles",
          "Certification : DELE",
        ],
      },
      {
        phase: "🇫🇷 Français",
        modules: [
          "Certifications : TCF, TEF, DALF, DELF",
        ],
      },
      {
        phase: "🇮🇹 Italien",
        modules: [
          "Certifications : CILS, CELI",
        ],
      },
      {
        phase: "🇷🇺 Russe",
        modules: [
          "Certification : TORFL",
        ],
      },
    ],
    prerequis: ["Aucun prérequis, tous niveaux acceptés"],
    debouches: [
      "Assistant bilingue",
      "Traducteur / Interprète",
      "Emplois nécessitant la maîtrise d'une langue étrangère",
      "Postes à l'international",
    ],
  },
  {
    id: 102,
    title: "Auto-École",
    category: "Formation Courte Durée 12 mois",
    duration: "12 mois",
    price: "110 000 FCFA au total",
    level: "baccalaureat/GCE A level",
    image: IMG_CAR,
    description:
      "Préparez-vous efficacement à l'examen du permis de conduire avec des cours théoriques et pratiques dispensés par des moniteurs expérimentés.",
    objectifs: [
      "Maîtriser le code de la route",
      "Acquérir les bases de la conduite en sécurité",
      "Préparer l'examen théorique",
      "Réussir l'épreuve pratique de conduite",
    ],
    programme: [
      {
        phase: "Frais détaillés",
        modules: [
          "💵 Frais de formation : 70 000 FCFA",
          "🧾 Frais d'inscription : 10 000 FCFA",
          "📝 Frais d'examen : 30 000 FCFA",
          "Total : 110 000 FCFA",
        ],
      },
      {
        phase: "Théorie",
        modules: [
          "Code de la route",
          "Signalisation routière",
          "Sécurité routière",
          "Premiers secours",
        ],
      },
      {
        phase: "Pratique",
        modules: [
          "Conduite en ville",
          "Conduite sur route",
          "Manœuvres d'examen",
          "Conduite de nuit",
        ],
      },
    ],
    prerequis: [
      "Âge minimum requis pour l'inscription à l'examen",
      "Dossier administratif complet",
    ],
    debouches: [
      "Obtention du permis de conduire",
      "Meilleure employabilité dans les métiers nécessitant la conduite",
    ],
  },
];
