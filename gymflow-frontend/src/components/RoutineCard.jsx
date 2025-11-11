import { useRef, useEffect, useState } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import ExerciseModal from "./ExerciseModal";
import toast from "react-hot-toast";

const API_URL = "http://127.0.0.1:8000/api";

const RoutineCard = ({ routine, selectedRoutine, setSelectedRoutine, user }) => {
  const isOpen = selectedRoutine === routine.id;
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const [currentWorkout, setCurrentWorkout] = useState({
    routineId: routine.id,
    exercises: [], // { exerciseId, setsData, done, started }
  });

  const [backendWorkout, setBackendWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    if (isOpen && contentRef.current) setHeight(contentRef.current.scrollHeight);
    else setHeight(0);
  }, [isOpen, routine.exercises]);

  const toggle = () => setSelectedRoutine(isOpen ? null : routine.id);

  const startExercise = (exercise) => {
    const activeExercise = currentWorkout.exercises.find(e => e.started && !e.done);

    if (activeExercise && activeExercise.exerciseId !== exercise.id) {
      toast.error(`Tenés otro ejercicio abierto: ${activeExercise.exercise.name}. Guardalo o cancelalo antes de abrir otro.`);
      return;
    }

    const exists = currentWorkout.exercises.find(e => e.exerciseId === exercise.id);
    if (!exists) {
      const initialReps = parseInt(exercise.reps) || 0;
      const setsData = Array.from({ length: exercise.sets }, () => ({
        repsDone: initialReps,
        weight: exercise.weight || "",
        notes: "",
      }));

      setCurrentWorkout(prev => ({
        ...prev,
        exercises: [
          ...prev.exercises,
          { exerciseId: exercise.id, exercise, setsData, done: false, started: true },
        ],
      }));
    } else {
      // Si ya existe, marcamos como started y reiniciamos done a false
      setCurrentWorkout(prev => ({
        ...prev,
        exercises: prev.exercises.map(e =>
          e.exerciseId === exercise.id ? { ...e, started: true, done: false } : e
        ),
      }));
    }

    setSelectedExercise(exercise);
  };

  const updateExerciseSets = async (exerciseId, updatedSets) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(e =>
        e.exerciseId === exerciseId ? { ...e, setsData: updatedSets, done: true } : e
      ),
    }));

    if (!user) {
      toast.error("Usuario no disponible");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      let workoutId = backendWorkout?.id;
      if (!workoutId) {
        const resWorkout = await fetch(`${API_URL}/workouts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            routine_id: routine.id,
            date: new Date().toISOString().split("T")[0],
          }),
        });

        if (!resWorkout.ok) throw new Error("Error creando workout");
        const workoutData = await resWorkout.json();
        setBackendWorkout(workoutData);
        workoutId = workoutData.id;
      }

      for (let i = 0; i < updatedSets.length; i++) {
        const set = updatedSets[i];
        await fetch(`${API_URL}/workouts/${workoutId}/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            exercise_id: exerciseId,
            set_number: i + 1,
            reps_done: set.repsDone,
            weight_used: set.weight || null,
            notes: set.notes || "",
          }),
        });
      }

      toast.success("✅ Ejercicio guardado correctamente");

    } catch (err) {
      console.error(err);
      toast.error("❌ Error al guardar ejercicio");
    }
  };

  return (
    <>
      <div
        key={routine.id}
        className={`routine-card ${isOpen ? "open" : ""}`}
        onClick={toggle}
        style={{ cursor: "pointer" }}
      >
        <div className="routine-header">
          <div className="header-left">
            <h4 className="dayOfWeek">{routine.day_of_week}</h4>
            <h3 className="routineName">{routine.name}</h3>
          </div>
          <div className="icon-container">
            {isOpen ? <FiChevronDown size={22} /> : <FiChevronRight size={22} />}
          </div>
        </div>

        <div
          className="exercises-dropdown"
          ref={contentRef}
          style={{
            maxHeight: `${height}px`,
            opacity: isOpen ? 1 : 0,
            transition: "max-height 0.4s ease, opacity 0.3s ease",
            overflow: "hidden",
            cursor: "default",
          }}
          onClick={e => e.stopPropagation()}
        >
          {routine.exercises?.length > 0 ? (
            <ul className="exercise-list">
              {routine.exercises.map(ex => {
                const exerciseState = currentWorkout.exercises.find(e => e.exerciseId === ex.id);

                return (
                  <li
                    key={ex.id}
                    className="liExercise"
                    style={{
                      border: exerciseState?.started && !exerciseState?.done ? "2px solid #4ade80" : "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "8px",
                      marginBottom: "6px",
                    }}
                  >
                    <div>
                      <strong>{ex.name}</strong>
                      <p>{ex.sets} x {ex.reps} {ex.weight && `${ex.weight}kg`}</p>
                    </div>
                    <button
                      className="btnHistorial"
                      onClick={async e => {
                        e.stopPropagation();

                        const token = localStorage.getItem("token");
                        if (!token) {
                          toast.error("No hay token de autenticación");
                          return;
                        }

                        try {
                          const res = await fetch(`${API_URL}/exercises/${ex.id}/history`, {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                          });

                          if (!res.ok) throw new Error("Error al obtener historial");
                          const data = await res.json();

                          console.log("Historial del ejercicio:", data);
                          toast.success(`Historial cargado (${data.length} registros)`);

                          // 👉 Podés reemplazar esto por abrir un modal en el futuro
                          alert(
                            data
                              .map(
                                l =>
                                  `${l.workout.date.split("T")[0]} - Serie ${l.set_number}: ${l.reps_done} reps, ${l.weight_used || "-"}kg`
                              )
                              .join("\n")
                          );
                        } catch (err) {
                          console.error(err);
                          toast.error("No se pudo cargar el historial");
                        }
                      }}
                    >
                      Historial
                    </button>
                    <button
                      className="btnEmpezarEzercise"
                      onClick={e => { e.stopPropagation(); startExercise(ex); }}
                    >
                      Empezar
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-exercises">Aún no hay ejercicios.</p>
          )}
        </div>
      </div>

      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          workoutExercise={currentWorkout.exercises.find(e => e.exerciseId === selectedExercise.id)}
          onClose={() => setSelectedExercise(null)}
          onSave={updateExerciseSets}
          setCurrentWorkout={setCurrentWorkout}
        />
      )}
    </>
  );
};

export default RoutineCard;
