// components/ExerciseModal.jsx
import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/api";

export default function ExerciseModal({ exercise, onClose }) {
  const [setsData, setSetsData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (exercise?.sets) {
      const repRange = parseReps(exercise.reps);
      const initialReps =
        repRange?.max || repRange?.min || parseInt(exercise.reps) || 0;

      setSetsData(
        Array.from({ length: exercise.sets }, () => ({
          repsDone: initialReps,
          weight: exercise.weight || "",
          notes: "",
        }))
      );
    }
  }, [exercise]);

  const parseReps = (repStr) => {
    if (!repStr) return null;
    const match = repStr.match(/(\d+)-(\d+)/);
    if (match) return { min: parseInt(match[1]), max: parseInt(match[2]) };
    const num = parseInt(repStr);
    return { min: num, max: num };
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const resetTimer = () => {
    setTimeLeft(120);
    setIsRunning(false);
  };

  const handleRepsChange = (index, delta) => {
    const updated = [...setsData];
    updated[index].repsDone = Math.max(0, updated[index].repsDone + delta);
    setSetsData(updated);
  };

  const handleNoteChange = (index, value) => {
    const updated = [...setsData];
    updated[index].notes = value;
    setSetsData(updated);
  };

  const handleWeightChange = (index, value) => {
    const updated = [...setsData];
    updated[index].weight = value;
    setSetsData(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const workoutId = localStorage.getItem("currentWorkoutId");

      if (!workoutId) {
        alert("No hay un entrenamiento activo.");
        setSaving(false);
        return;
      }

      for (let i = 0; i < setsData.length; i++) {
        const set = setsData[i];
        await fetch(`${API_URL}/workouts/${workoutId}/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            exercise_id: exercise.id,
            set_number: i + 1,
            reps_done: set.repsDone,
            weight_used: set.weight || exercise.weight || null,
            notes: set.notes || "",
          }),
        });
      }

      alert("✅ Ejercicio guardado correctamente");
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar los datos");
    } finally {
      setSaving(false);
    }
  };

  if (!exercise) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="exercise-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{exercise.name}</h2>
        <p>
          Objetivo: {exercise.sets} x {exercise.reps}{" "}
          {exercise.weight && `${exercise.weight}kg`}
        </p>

        <div className="sets-inputs">
          {setsData.map((set, i) => (
            <div key={i} className="set-row">
              <label>Serie {i + 1}</label>

              <div className="reps-control">
                <button onClick={() => handleRepsChange(i, -1)} className="reps-btn">
                  –
                </button>
                <input type="number" value={set.repsDone} readOnly className="reps-input" />
                <button onClick={() => handleRepsChange(i, +1)} className="reps-btn">
                  +
                </button>
              </div>

              <input
                type="number"
                placeholder="Peso (kg)"
                value={set.weight}
                onChange={(e) => handleWeightChange(i, e.target.value)}
                className="weight-input"
              />

              <input
                type="text"
                placeholder="Notas"
                value={set.notes}
                onChange={(e) => handleNoteChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="timer-container">
          <h3>{formatTime(timeLeft)}</h3>
          <div className="timer-buttons">
            {!isRunning ? (
              <button onClick={() => setIsRunning(true)}>Iniciar descanso</button>
            ) : (
              <button onClick={() => setIsRunning(false)}>Pausar</button>
            )}
            <button onClick={resetTimer}>Reiniciar</button>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
