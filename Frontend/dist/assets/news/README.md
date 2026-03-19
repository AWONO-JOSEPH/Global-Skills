# Placeholder pour les actualités
# Ces instructions expliquent comment ajouter vos propres images et vidéos

## Images locales
1. Placez vos images dans : `public/assets/news/`
2. Nommez-les selon l'ID de l'actualité :
   - `1-formation-ia.jpg` pour l'actualité ID 1
   - `2-seminaire-tech.jpg` pour l'actualité ID 2
   - etc.

## Vidéos locales  
1. Placez vos vidéos dans : `public/assets/videos/`
2. Nommez-les selon l'ID de l'actualité :
   - `1-demo-formation.mp4` pour l'actualité ID 1
   - `2-demo-seminaire.mp4` pour l'actualité ID 2
   - etc.

## Formats recommandés
- **Images** : JPG, PNG, WebP (max 2MB)
- **Vidéos** : MP4, WebM (max 10MB)
- **Dimensions** : 800x600 minimum pour les images
- **Qualité** : Optimisée pour le web

## Intégration automatique
Le système utilise automatiquement les médias locaux si disponibles :
```typescript
// Dans src/data/newsMedia.ts
export const newsImages = {
  1: '/assets/news/1-formation-ia.jpg',
  2: '/assets/news/2-seminaire-tech.jpg',
};

export const newsVideos = {
  1: '/assets/videos/1-demo-formation.mp4',
  2: '/assets/videos/2-demo-seminaire.mp4',
};
```

Si un média local n'existe pas, le système utilisera l'URL externe de la base de données.
