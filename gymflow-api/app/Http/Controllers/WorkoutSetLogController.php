<?php

namespace App\Http\Controllers;

use App\Models\Workout;
use App\Models\WorkoutSetLog;
use Illuminate\Http\Request;

class WorkoutSetLogController extends Controller
{
    public function store(Request $request, Workout $workout)
    {
        $data = $request->validate([
            'exercise_id' => 'required|exists:exercises,id',
            'set_number' => 'required|integer|min:1',
            'reps_done' => 'required|integer|min:0',
            'weight_used' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        $log = $workout->logs()->create($data);

        return response()->json($log, 201);
    }

    public function update(Request $request, WorkoutSetLog $log)
    {
        $data = $request->validate([
            'reps_done' => 'integer|min:0',
            'weight_used' => 'numeric|nullable',
            'notes' => 'string|nullable',
        ]);

        $log->update($data);

        return response()->json($log);
    }

    public function destroy(WorkoutSetLog $log)
    {
        $log->delete();
        return response()->noContent();
    }
}
