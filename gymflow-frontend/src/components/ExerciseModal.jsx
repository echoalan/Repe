import { useState, useEffect } from "react";
const TIMER_KEY = "exercise_timer";

export default function ExerciseModal({ exercise, workoutExercise, onClose, onSave, setCurrentWorkout }) {
  const [setsData, setSetsData] = useState([]);

    useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
    }, []); 

  useEffect(() => {
    if (workoutExercise?.setsData?.length) {
      setSetsData(workoutExercise.setsData);
    } else if (exercise?.sets) {
      const initialReps = parseInt(exercise.reps) || 0;
      setSetsData(
        Array.from({ length: exercise.sets }, () => ({
          repsDone: initialReps,
          weight: exercise.weight || "",
          notes: "",
        }))
      );
    }
  }, [exercise, workoutExercise]);

  // 🕒 Timer persistente
  const getInitialTimer = () => {
    const saved = JSON.parse(localStorage.getItem(TIMER_KEY));
    return saved ? saved.timeLeft : 120;
  };

  const getInitialRunning = () => {
    const saved = JSON.parse(localStorage.getItem(TIMER_KEY));
    return saved ? saved.isRunning : false;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimer);
  const [isRunning, setIsRunning] = useState(getInitialRunning);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          localStorage.setItem(TIMER_KEY, JSON.stringify({ timeLeft: newTime, isRunning: true }));
          return newTime;
        });
      }, 1000);
    } else {
      localStorage.setItem(TIMER_KEY, JSON.stringify({ timeLeft, isRunning }));
    }

    if (timeLeft === 0) setIsRunning(false);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // 🏋️‍♂️ Handlers
  const handleRepsChange = (index, delta) =>
    setSetsData(prev =>
      prev.map((s, i) =>
        i === index ? { ...s, repsDone: Math.max(0, s.repsDone + delta) } : s
      )
    );

  const handleWeightChange = (index, value) =>
    setSetsData(prev =>
      prev.map((s, i) => (i === index ? { ...s, weight: value } : s))
    );

  const handleNoteChange = (index, value) =>
    setSetsData(prev =>
      prev.map((s, i) => (i === index ? { ...s, notes: value } : s))
    );

  const handleSave = () => {
    onSave(exercise.id, setsData);
  };

  const handleClose = () => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(e =>
        e.exerciseId === exercise.id ? { ...e, setsData } : e
      ),
    }));
    onClose();
  };

  if (!exercise) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="exercise-modal" onClick={e => e.stopPropagation()}>
        <h2>{exercise.name}</h2>

        <div className="sets-inputs">
          <h4 className="titleRepeIdeal">
            Ideal: {exercise.sets} x {exercise.reps}{" "}
            {exercise.weight && `${exercise.weight}kg`}
          </h4>

          {setsData.map((set, i) => (
            <div key={i} className="set-row">
              <label>Serie {i + 1}</label>

              <div className="reps-control">
                <button
                  className="reps-btn"
                  onClick={() => handleRepsChange(i, -1)}
                >
                  –
                </button>
                <input
                  className="reps-input"
                  type="number"
                  value={set.repsDone}
                  readOnly
                />
                <button
                  className="reps-btn"
                  onClick={() => handleRepsChange(i, +1)}
                >
                  +
                </button>
              </div>

              <div className="weight-group">
                <label className="weight-label">Peso</label>
                <input
                  className="weight-input"
                  type="number"
                  placeholder="Peso (kg)"
                  value={set.weight}
                  onChange={e => handleWeightChange(i, e.target.value)}
                />
              </div>

              <input
                type="text"
                placeholder="Notas"
                value={set.notes}
                onChange={e => handleNoteChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="timer-container">
          <h3>
            {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(
              2,
              "0"
            )}`}
          </h3>
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? "Pausar" : "Iniciar descanso"}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(120);
              localStorage.setItem(
                TIMER_KEY,
                JSON.stringify({ timeLeft: 120, isRunning: false })
              );
            }}
          >
            Reiniciar
          </button>
        </div>

        <div className="modal-actions">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={handleClose}>Cerrar</button>
          <button
            onClick={() => {
              setCurrentWorkout(prev => ({
                ...prev,
                exercises: prev.exercises.filter(
                  e => e.exerciseId !== workoutExercise.exerciseId
                ),
              }));
              onClose();
            }}
          >
            Cancelar ejercicio
          </button>
        </div>
      </div>
    </div>
  );
}
