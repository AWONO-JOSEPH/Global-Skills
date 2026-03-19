<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Formation;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer des utilisateurs étudiants
        $studentUsers = [
            ['name' => 'Alice Dupont', 'email' => 'alice@example.com', 'role' => 'student'],
            ['name' => 'Bob Martin', 'email' => 'bob@example.com', 'role' => 'student'],
            ['name' => 'Claire Bernard', 'email' => 'claire@example.com', 'role' => 'student'],
            ['name' => 'David Petit', 'email' => 'david@example.com', 'role' => 'student'],
            ['name' => 'Emma Leroy', 'email' => 'emma@example.com', 'role' => 'student'],
        ];

        foreach ($studentUsers as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                array_merge($userData, ['password' => bcrypt('password')])
            );

            // Récupérer la première formation
            $formation = Formation::first();
            
            if ($formation) {
                Student::create([
                    'matricule' => 'STU' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                    'user_id' => $user->id,
                    'formation_id' => $formation->id,
                    'presence_count' => rand(0, 10),
                    'total_sessions' => 20,
                    'average_note' => rand(8, 18) + (rand(0, 99) / 100),
                ]);
            }
        }
    }
}
