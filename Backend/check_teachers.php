<?php

use App\Models\Formation;
use App\Models\User;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$formations = Formation::all();
echo "Total Formations: " . $formations->count() . "\n";

foreach ($formations as $f) {
    $teacher = $f->teacher_id ? User::find($f->teacher_id) : null;
    echo "Formation: {$f->name} (ID: {$f->id})\n";
    echo "Teacher: " . ($teacher ? $teacher->email : "SANS FORMATEUR") . "\n";
    echo "--------------------------\n";
}

$teachers = User::where('role', 'teacher')->get();
echo "Total Formateurs: " . $teachers->count() . "\n";
foreach ($teachers as $t) {
    echo "Formateur: {$t->email} (ID: {$t->id})\n";
}
