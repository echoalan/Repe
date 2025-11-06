<?php

namespace App\Http\Controllers;

use App\Models\Routine;
use Illuminate\Http\Request;

class RoutineController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->routines;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'day_of_week' => 'required|string'
        ]);

        $routine = $request->user()->routines()->create($data);

        return response()->json($routine, 201);
    }

    public function show(Routine $routine)
    {
        return $routine->load('exercises');
    }

    public function update(Request $request, Routine $routine)
    {
        $routine->update($request->only(['name', 'day_of_week']));
        return response()->json($routine);
    }

    public function destroy(Routine $routine)
    {
        $routine->delete();
        return response()->noContent();
    }
}
