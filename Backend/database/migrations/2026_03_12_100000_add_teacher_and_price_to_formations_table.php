<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->foreignId('teacher_id')
                ->nullable()
                ->after('name')
                ->constrained('users')
                ->nullOnDelete();

            $table->unsignedBigInteger('price')
                ->default(0)
                ->after('enrolled_students');
        });
    }

    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('teacher_id');
            $table->dropColumn('price');
        });
    }
};

