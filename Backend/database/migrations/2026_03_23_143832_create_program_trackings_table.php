<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('program_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Le formateur
            $table->foreignId('formation_id')->constrained()->onDelete('cascade');
            $table->string('subject'); // Matière dispensée
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->text('report_content'); // Rapport synthétique du cours
            $table->timestamp('teacher_signed_at')->nullable();
            $table->timestamp('admin_signed_at')->nullable();
            $table->string('week_range')->nullable(); // Ex: "Semaine du 23 au 27 Février 2026"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_trackings');
    }
};
