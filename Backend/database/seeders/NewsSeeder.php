<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        News::updateOrCreate(
            ['title' => 'Vacances Utiles 2026 : Inscriptions Ouvertes !'],
            [
                'description' => 'Apprenez une compétence en seulement 2 à 3 mois ! Global Skills Academy lance son programme de vacances avec des packs Découverte, Bureautique, Digital et Pro. Inscriptions ouvertes à Yaoundé Ngousso, places limitées !',
                'category' => 'Événement',
                'published_at' => '2026-06-16 10:00:00',
                'image' => '/assets/news/2026.jpg',
            ]
        );

        News::updateOrCreate(
            ['title' => 'Nouveau Partenariat Stratégique'],
            [
                'description' => 'Global Skills Academy est fier d\'annoncer un nouveau partenariat avec des entreprises locales pour faciliter l\'insertion professionnelle de nos étudiants.',
                'category' => 'Partenariat',
                'published_at' => '2026-05-20 09:00:00',
                'image' => null,
            ]
        );
    }
}
