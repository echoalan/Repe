<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'routine_id',
        'name',
        'sets',
        'reps',
        'weight',
        'rest_seconds',
        'notes',
    ];

    public function routine()
    {
        return $this->belongsTo(Routine::class);
    }

    public function workoutLogs()
    {
        return $this->hasMany(WorkoutLog::class);
    }
}
