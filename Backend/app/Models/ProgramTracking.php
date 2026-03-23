<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramTracking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'formation_id',
        'subject',
        'date',
        'start_time',
        'end_time',
        'report_content',
        'teacher_signed_at',
        'admin_signed_at',
        'week_range',
    ];

    protected $casts = [
        'date' => 'date',
        'teacher_signed_at' => 'datetime',
        'admin_signed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }
}
