<?php

namespace Database\Seeders;

use App\Models\User;
use App\Mail\AccountCreated;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Création / mise à jour des comptes clés avec mot de passe temporaire
        $this->createOrResetUser(
            name: 'Admin Global Skills',
            email: 'remilionara@gmail.com',
            role: 'admin'
        );

        $this->createOrResetUser(
            name: 'Formateur Global Skills',
            email: 'razielmemphis80@gmail.com',
            role: 'teacher'
        );

        $this->createOrResetUser(
            name: 'Étudiant Global Skills',
            email: 'manuemma648@gmail.com',
            role: 'student'
        );

        // Création d'une formation de test
        $formation = \App\Models\Formation::updateOrCreate(
            ['name' => 'Formation Marketing Digital'],
            [
                'teacher_id' => User::where('role', 'teacher')->first()->id,
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'capacity' => 50,
                'enrolled_students' => 1,
                'price' => 100000,
            ]
        );

        // Création de quelques cours pour la formation
        \App\Models\Course::updateOrCreate(
            ['name' => 'SEO et Référencement', 'formation_id' => $formation->id],
            ['date' => '2026-03-10', 'start_time' => '09:00:00', 'end_time' => '12:00:00', 'room' => 'A201']
        );
        
        \App\Models\Course::updateOrCreate(
            ['name' => 'Social Media Marketing', 'formation_id' => $formation->id],
            ['date' => '2026-03-12', 'start_time' => '14:00:00', 'end_time' => '17:00:00', 'room' => 'B105']
        );

        \App\Models\Course::updateOrCreate(
            ['name' => 'Google Ads', 'formation_id' => $formation->id],
            ['date' => '2026-03-15', 'start_time' => '09:00:00', 'end_time' => '12:00:00', 'room' => 'A201']
        );

        \App\Models\Course::updateOrCreate(
            ['name' => 'Email Marketing', 'formation_id' => $formation->id],
            ['date' => '2026-03-18', 'start_time' => '10:00:00', 'end_time' => '13:00:00', 'room' => 'C302']
        );

        // Mise à jour de l'étudiant pour l'associer à la formation et ajouter des données de progression
        $studentUser = User::where('email', 'manuemma648@gmail.com')->first();
        if ($studentUser) {
            $studentUser->update(['formation_id' => $formation->id]);
            \App\Models\Student::updateOrCreate(
                ['user_id' => $studentUser->id],
                [
                    'matricule' => 'GS-STU-001',
                    'formation_id' => $formation->id,
                    'presence_count' => 15,
                    'total_sessions' => 20,
                    'average_note' => 16.5,
                ]
            );

            // Création de quelques documents pour l'étudiant
            \App\Models\Document::updateOrCreate(
                ['name' => 'Attestation d\'inscription', 'user_id' => $studentUser->id],
                ['file_path' => '/documents/attestation-inscription.pdf', 'type' => 'PDF', 'date' => '2026-01-15']
            );
            \App\Models\Document::updateOrCreate(
                ['name' => 'Programme de formation', 'user_id' => $studentUser->id],
                ['file_path' => '/documents/programme-formation.pdf', 'type' => 'PDF', 'date' => '2026-01-16']
            );
            \App\Models\Document::updateOrCreate(
                ['name' => 'Calendrier des cours', 'user_id' => $studentUser->id],
                ['file_path' => '/documents/calendrier-cours.pdf', 'type' => 'PDF', 'date' => '2026-01-20']
            );

            // Création de quelques notifications pour l'étudiant
            \App\Models\Notification::updateOrCreate(
                ['title' => 'Nouveau cours disponible', 'user_id' => $studentUser->id],
                ['message' => 'Le cours de Content Marketing est maintenant disponible', 'is_read' => false]
            );
            \App\Models\Notification::updateOrCreate(
                ['title' => 'Paiement en attente', 'user_id' => $studentUser->id],
                ['message' => 'Votre paiement de mars est en attente', 'is_read' => false]
            );
            \App\Models\Notification::updateOrCreate(
                ['title' => 'Note disponible', 'user_id' => $studentUser->id],
                ['message' => 'Votre note pour l\'examen de SEO est disponible', 'is_read' => true]
            );

            // Get the first course for the formation
            $seoCourse = \App\Models\Course::where('name', 'SEO et Référencement')->first();

            // Création de quelques notes pour l'étudiant
            \App\Models\Note::updateOrCreate(
                ['user_id' => $studentUser->id, 'subject' => 'SEO et Référencement'],
                ['course_id' => $seoCourse->id, 'score' => 16.0, 'max_score' => 20.0, 'evaluation_date' => '2026-02-25']
            );
            \App\Models\Note::updateOrCreate(
                ['user_id' => $studentUser->id, 'subject' => 'Communication Digitale'],
                ['score' => 18.0, 'max_score' => 20.0, 'evaluation_date' => '2026-02-20']
            );
            \App\Models\Note::updateOrCreate(
                ['user_id' => $studentUser->id, 'subject' => 'Outils Bureautiques'],
                ['score' => 15.0, 'max_score' => 20.0, 'evaluation_date' => '2026-02-15']
            );
        }

        // Création de cours de test pour la formation
        \App\Models\Course::updateOrCreate(
            ['name' => 'SEO et Référencement', 'formation_id' => $formation->id],
            [
                'date' => '2026-03-10',
                'start_time' => '09:00:00',
                'end_time' => '12:00:00',
                'room' => 'A201',
            ]
        );
        \App\Models\Course::updateOrCreate(
            ['name' => 'Social Media Marketing', 'formation_id' => $formation->id],
            [
                'date' => '2026-03-12',
                'start_time' => '14:00:00',
                'end_time' => '17:00:00',
                'room' => 'B105',
            ]
        );
        \App\Models\Course::updateOrCreate(
            ['name' => 'Google Ads', 'formation_id' => $formation->id],
            [
                'date' => '2026-03-15',
                'start_time' => '09:00:00',
                'end_time' => '12:00:00',
                'room' => 'A201',
            ]
        );
        \App\Models\Course::updateOrCreate(
            ['name' => 'Email Marketing', 'formation_id' => $formation->id],
            [
                'date' => '2026-03-18',
                'start_time' => '10:00:00',
                'end_time' => '13:00:00',
                'room' => 'C302',
            ]
        );
    }

    /**
     * Crée ou remet à zéro un utilisateur, génère un mot de passe temporaire
     * et envoie un email avec les identifiants.
     */
    protected function createOrResetUser(string $name, string $email, string $role): void
    {
        $tempPassword = Str::random(10);

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'role' => $role,
                'password' => Hash::make('password'),
                'must_change_password' => true,
            ]
        );

        // Mail::to($user->email)->send(new AccountCreated($user, $tempPassword));
    }
}
