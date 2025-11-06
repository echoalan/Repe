<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\Routine;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function store(Request $request, Routine $routine)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'sets' => 'nullable|integer',
            'reps' => 'nullable|string',
            'weight' => 'nullable|numeric',
            'rest_seconds' => 'nullable|integer',
            'notes' => 'nullable|string'
        ]);

        $exercise = $routine->exercises()->create($data);
        return response()->json($exercise, 201);
    }

    public function update(Request $request, Exercise $exercise)
    {
        $exercise->update($request->all());
        return response()->json($exercise);
    }

    public function destroy(Exercise $exercise)
    {
        $exercise->delete();
        return response()->noContent();
    }
}
