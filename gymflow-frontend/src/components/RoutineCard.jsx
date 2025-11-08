// components/RoutineCard.jsx
import { useRef, useEffect, useState } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import ExerciseModal from "./ExerciseModal";

const API_URL = "http://127.0.0.1:8000/api";

const RoutineCard = ({ routine, selectedRoutine, setSelectedRoutine, user }) => {
  const isOpen = selectedRoutine === routine.id;
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutId, setWorkoutId] = useState(localStorage.getItem("currentWorkoutId") || null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen, routine.exercises]);

  const toggle = () => {
    setSelectedRoutine(isOpen ? null : routine.id);
  };

const startWorkout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!user?.id) {
      console.error("Usuario no disponible");
      alert("Esperando datos del usuario...");
      return;
    }

    const res = await fetch(`${API_URL}/workouts`, {
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

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error del servidor: ${text}`);
    }

    const data = await res.json();
    localStorage.setItem("currentWorkoutId", data.id);
    setWorkoutId(data.id);
    return data.id;
  } catch (err) {
    console.error("Error al iniciar el workout:", err);
  }
};


  const endWorkout = async () => {
    if (!workoutId) return alert("No hay entrenamiento activo");
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/workouts/${workoutId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ finished: true }),
      });
      localStorage.removeItem("currentWorkoutId");
      setWorkoutId(null);
      alert("💪 Entrenamiento finalizado correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo finalizar el entrenamiento");
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
            {isOpen ? (
              <FiChevronDown size={22} className="icon-open" />
            ) : (
              <FiChevronRight size={22} className="icon-closed" />
            )}
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
          onClick={(e) => e.stopPropagation()}
        >
          {routine.exercises?.length > 0 ? (
            <ul className="exercise-list">
              {routine.exercises.map((ex) => (
                <li key={ex.id} className="liExercise">
                  <div>
                    <strong>{ex.name}</strong>
                    <p>
                      {ex.sets && ex.reps ? `${ex.sets} x ${ex.reps}` : ""}
                      {ex.weight ? ` ${ex.weight}kg` : ""}
                    </p>
                  </div>
                  <button
                    className="btnEmpezarEzercise"
                    onClick={async (e) => {
                      e.stopPropagation();
                      let id = localStorage.getItem("currentWorkoutId");
                      if (!id) id = await startWorkout();
                      setSelectedExercise(ex);
                    }}
                  >
                    Empezar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-exercises">Aún no hay ejercicios.</p>
          )}

          {workoutId && (
            <button
              className="btnFinalizarWorkout"
              onClick={(e) => {
                e.stopPropagation();
                endWorkout();
              }}
              style={{
                marginTop: "1rem",
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
              }}
            >
              Finalizar entrenamiento
            </button>
          )}
        </div>
      </div>

      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </>
  );
};

export default RoutineCard;
