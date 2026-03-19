<?php

use App\Models\User;
use App\Models\Student;
use App\Models\Formation;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$email = 'rickymanfred884@gmail.com';
$user = User::where('email', $email)->first();

if (!$user) {
    echo "Utilisateur non trouvé : $email\n";
    exit;
}

echo "Utilisateur trouvé : {$user->name} (ID: {$user->id})\n";
echo "Rôle : {$user->role}\n";
echo "Formation ID (User table) : " . ($user->formation_id ?? 'NULL') . "\n";

$student = Student::where('user_id', $user->id)->first();
if (!$student) {
    echo "Record Student MANQUANT ! Création en cours...\n";
    $student = Student::create([
        'user_id' => $user->id,
        'formation_id' => $user->formation_id,
        'matricule' => 'GS-' . strtoupper(Str::random(6)),
    ]);
    echo "Record Student créé (ID: {$student->id})\n";
} else {
    echo "Record Student trouvé (ID: {$student->id})\n";
    echo "Formation ID (Student table) : " . ($student->formation_id ?? 'NULL') . "\n";
    
    if ($student->formation_id != $user->formation_id) {
        echo "Désynchronisation détectée ! Mise à jour du Student...\n";
        $student->update(['formation_id' => $user->formation_id]);
        echo "Formation ID synchronisée.\n";
    }
}

if ($student->formation_id) {
    $formation = Formation::find($student->formation_id);
    echo "Formation associée : " . ($formation ? $formation->name : "NON TROUVÉE EN BASE") . "\n";
} else {
    echo "Aucune formation associée au Student.\n";
}
