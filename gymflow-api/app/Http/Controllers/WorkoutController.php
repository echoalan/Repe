<?php

namespace App\Http\Controllers;

use App\Models\Workout;

use Illuminate\Http\Request;

class WorkoutController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->workouts()
            ->with(['logs.exercise'])
            ->orderByDesc('date')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'routine_id' => 'required|exists:routines,id',
            'date' => 'required|date',
        ]);

        $workout = $request->user()->workouts()->create($data);

        return response()->json($workout, 201);
    }

    public function show(Workout $workout)
    {
        $this->authorize('view', $workout);
        return $workout->load(['setLogs.exercise']);
    }

    public function destroy(Workout $workout)
    {
        $this->authorize('delete', $workout);
        $workout->delete();
        return response()->noContent();
    }
}
