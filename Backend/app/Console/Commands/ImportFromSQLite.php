<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportFromSQLite extends Command
{
    protected $signature = 'import:sqlite';
    protected $description = 'Import data from SQLite export files';

    public function handle()
    {
        $tables = [
            'news',
            'formations',
            'users',
            'students',
            'payments',
            'courses',
            'documents',
            'notifications',
            'notes',
            'contact_messages',
            'international_requests',
            'program_trackings',
        ];

        // For tables with circular dependencies, we'll store the original data to update later
        $formationsData = [];

        foreach ($tables as $table) {
            $file = base_path("{$table}_export.json");
            
            if (!file_exists($file)) {
                $this->warn("Fichier manquant : {$table}_export.json, ignoré.");
                continue;
            }

            $data = json_decode(file_get_contents($file), true);
            
            if (empty($data)) {
                $this->info("Table {$table} : vide, ignorée.");
                continue;
            }

            // Special handling for circular dependencies
            if ($table === 'formations') {
                $formationsData = $data;
                // Temporarily set teacher_id to null
                $data = array_map(function($item) {
                    $item['teacher_id'] = null;
                    return $item;
                }, $data);
            }

            if ($table === 'users') {
                // Temporarily set formation_id to null if it's not present yet
                $data = array_map(function($item) {
                    // Check if formation exists
                    if (isset($item['formation_id'])) {
                        $item['formation_id'] = null; // We'll update this later too if needed
                    }
                    return $item;
                }, $data);
            }

            // Vide la table avant d'importer
            try {
                DB::table($table)->delete();
            } catch (\Exception $e) {
                $this->warn("Erreur lors du nettoyage de {$table} : " . $e->getMessage());
            }
            
            // Insère par batch de 100
            foreach (array_chunk($data, 100) as $chunk) {
                DB::table($table)->insert($chunk);
            }

            $this->info("✅ Table {$table} : " . count($data) . " lignes importées (partiellement pour certaines).");
        }

        // Now restore foreign keys
        $this->info("Mise à jour des relations...");

        // 1. Update users with their real formation_id
        $usersFile = base_path("users_export.json");
        if (file_exists($usersFile)) {
            $usersData = json_decode(file_get_contents($usersFile), true);
            foreach ($usersData as $user) {
                if (isset($user['formation_id']) && $user['formation_id'] !== null) {
                    DB::table('users')->where('id', $user['id'])->update(['formation_id' => $user['formation_id']]);
                }
            }
        }

        // 2. Update formations with their real teacher_id
        foreach ($formationsData as $formation) {
            if (isset($formation['teacher_id']) && $formation['teacher_id'] !== null) {
                DB::table('formations')->where('id', $formation['id'])->update(['teacher_id' => $formation['teacher_id']]);
            }
        }

        $this->info('Import terminé !');
    }
}
