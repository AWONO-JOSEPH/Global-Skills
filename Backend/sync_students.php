<?php

use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Str;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$students = User::where('role', 'student')->get();
echo "Synchronisation de " . $students->count() . " étudiants...\n";

foreach ($students as $user) {
    $student = Student::where('user_id', $user->id)->first();
    if (!$student) {
        $student = Student::create([
            'user_id' => $user->id,
            'formation_id' => $user->formation_id,
            'matricule' => 'GS-' . strtoupper(Str::random(6)),
        ]);
        echo "Créé : {$user->email} (Matricule: {$student->matricule})\n";
    } else {
        if ($student->formation_id != $user->formation_id) {
            $student->update(['formation_id' => $user->formation_id]);
            echo "Mis à jour : {$user->email}\n";
        }
    }
}

echo "Terminé.\n";
