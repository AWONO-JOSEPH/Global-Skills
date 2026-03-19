<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Formation;

class FormationTeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer le teacher
        $teacher = User::where('role', 'teacher')->first();
        
        if ($teacher) {
            // Assigner le teacher à toutes les formations
            Formation::query()->update(['teacher_id' => $teacher->id]);
            
            echo "Teacher {$teacher->name} assigné aux formations\n";
        } else {
            echo "Aucun teacher trouvé\n";
        }
    }
}
