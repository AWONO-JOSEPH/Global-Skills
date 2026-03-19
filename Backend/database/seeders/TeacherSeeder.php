<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Formation;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur teacher
        $teacher = User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'name' => 'John Teacher',
                'role' => 'teacher',
                'password' => bcrypt('password'),
                'specialite' => 'Développement Web',
            ]
        );

        // Assigner le teacher à la première formation
        $formation = Formation::first();
        if ($formation) {
            $formation->update(['teacher_id' => $teacher->id]);
        }
    }
}
