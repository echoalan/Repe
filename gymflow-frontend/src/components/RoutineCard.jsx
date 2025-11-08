import { useRef, useEffect, useState } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import ExerciseModal from "./ExerciseModal";

const RoutineCard = ({ routine, selectedRoutine, setSelectedRoutine }) => {
  const isOpen = selectedRoutine === routine.id;
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null); // 👈 nuevo

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
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExercise(ex); // 👈 abre modal
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
        </div>
      </div>

      {/* 👇 Modal dinámico */}
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
