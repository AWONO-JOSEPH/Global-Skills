<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FixPostgresSequences extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:fix-sequences';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset PostgreSQL sequences for all tables to match the current maximum ID.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (config('database.default') !== 'pgsql') {
            $this->error('This command only works for PostgreSQL databases.');
            return 1;
        }

        $tables = [
            'users',
            'formations',
            'students',
            'payments',
            'courses',
            'documents',
            'notifications',
            'notes',
            'news',
            'contact_messages',
            'international_requests',
            'program_trackings',
            'failed_jobs',
            'jobs',
            'job_batches',
            'cache',
            'cache_locks',
            'sessions'
        ];

        foreach ($tables as $table) {
            if (!Schema::hasTable($table)) {
                $this->warn("Table '$table' does not exist, skipping.");
                continue;
            }

            // Check if table has an 'id' column
            if (!Schema::hasColumn($table, 'id')) {
                $this->info("Table '$table' has no 'id' column, skipping sequence reset.");
                continue;
            }

            try {
                // Get the sequence name for the 'id' column
                $sequenceQuery = DB::selectOne("SELECT pg_get_serial_sequence('\"$table\"', 'id') as sequence_name");
                $sequenceName = $sequenceQuery->sequence_name;

                if ($sequenceName) {
                    // Reset the sequence to the current max(id)
                    DB::statement("SELECT setval('$sequenceName', COALESCE((SELECT MAX(id) FROM \"$table\"), 1))");
                    $this->info("✅ Sequence reset for table '$table'.");
                } else {
                    $this->info("Table '$table' has no serial sequence for 'id', skipping.");
                }
            } catch (\Exception $e) {
                $this->error("Failed to reset sequence for table '$table': " . $e->getMessage());
            }
        }

        $this->info('PostgreSQL sequence reset complete.');
    }
}
