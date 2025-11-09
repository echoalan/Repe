import { useState, useEffect } from "react";

export default function ExerciseModal({ exercise, workoutExercise, onClose, onSave }) {
  const [setsData, setSetsData] = useState([]);

  useEffect(() => {
    if (workoutExercise?.setsData?.length) {
      setSetsData(workoutExercise.setsData);
    } else if (exercise?.sets) {
      const initialReps = parseInt(exercise.reps) || 0;
      setSetsData(Array.from({ length: exercise.sets }, () => ({
        repsDone: initialReps,
        weight: exercise.weight || "",
        notes: "",
      })));
    }
  }, [exercise, workoutExercise]);

  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);

  const handleRepsChange = (index, delta) =>
    setSetsData(prev => prev.map((s, i) => i === index ? { ...s, repsDone: Math.max(0, s.repsDone + delta) } : s));

  const handleWeightChange = (index, value) =>
    setSetsData(prev => prev.map((s, i) => i === index ? { ...s, weight: value } : s));

  const handleNoteChange = (index, value) =>
    setSetsData(prev => prev.map((s, i) => i === index ? { ...s, notes: value } : s));

  const handleSave = () => {
    onSave(exercise.id, setsData); // Guardar en backend
    onClose(); // Cierra modal
  };

  if (!exercise) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="exercise-modal" onClick={e => e.stopPropagation()}>
        <h2>{exercise.name}</h2>
        <div className="sets-inputs">
          {setsData.map((set, i) => (
            <div key={i} className="set-row">
              <label>Serie {i+1}</label>
              <div className="reps-control">
                <button className="reps-btn" onClick={() => handleRepsChange(i, -1)}>–</button>
                <input className="reps-input" type="number" value={set.repsDone} readOnly />
                <button className="reps-btn" onClick={() => handleRepsChange(i, +1)}>+</button>
              </div>
              <input className="weight-input" type="number" placeholder="Peso (kg)" value={set.weight} onChange={e => handleWeightChange(i, e.target.value)} />
              <input type="text" placeholder="Notas" value={set.notes} onChange={e => handleNoteChange(i, e.target.value)} />
            </div>
          ))}
        </div>

        <div className="timer-container">
          <h3>{`${Math.floor(timeLeft/60)}:${String(timeLeft % 60).padStart(2,'0')}`}</h3>
          <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pausar" : "Iniciar descanso"}</button>
          <button onClick={() => { setIsRunning(false); setTimeLeft(120); }}>Reiniciar</button>
        </div>

        <div className="modal-actions">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
