import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: "", reps: "" });

  const API_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    if (!user) return (window.location.href = "/");
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/routines`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setRoutines(data);
    }
  };

  const fetchExercises = async (routineId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/routines/${routineId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setExercises(data.exercises || []);
      setSelectedRoutine(routineId);
    }
  };

  const addExercise = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!newExercise.name.trim()) return;
    const res = await fetch(`${API_URL}/routines/${selectedRoutine}/exercises`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newExercise),
    });

    if (res.ok) {
      setNewExercise({ name: "", reps: "" });
      fetchExercises(selectedRoutine);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏋️‍♂️ Repe</h1>
        <div className="user-info">
          <button onClick={logout} className="logout-btn">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">

        <section className="routines-section">

          <h3 className="subtitleRutines">Rutina</h3>

          {routines.length === 0 ? (
            <p className="no-routines">Aún no tienes rutinas registradas.</p>
          ) : (
            <div className="routines-grid">
              {routines.map((routine) => (
                <div key={routine.id} className="routine-card">
                  <div
                    className="routine-header"
                    onClick={() =>
                      selectedRoutine === routine.id
                        ? setSelectedRoutine(null)
                        : fetchExercises(routine.id)
                    }
                  >
                    <h4 className="dayOfWeek">{routine.day_of_week}</h4>
                    <h3 className="routineName">{routine.name}</h3>
                  </div>
                  <div className="containerVerExercises">
                    <button
                      className="see-exercises-btn"

                    >
                      <span className={`triangle ${selectedRoutine === routine.id ? "open" : ""}`}>▶</span>
                    </button>
                  </div>



                  {/* Sección expandible */}
                  <div
                    className={`exercises-dropdown ${selectedRoutine === routine.id ? "open" : ""
                      }`}
                  >
                    {selectedRoutine === routine.id && (
                      <>
                        {exercises.length === 0 ? (
                          <p className="no-exercises">
                            Aún no hay ejercicios.
                          </p>
                        ) : (
                          <ul className="exercise-list">
                            {exercises.map((ex) => (
                              <li key={ex.id}>
                                <strong>{ex.name}</strong>
                                {ex.sets && ex.reps ? ` ${ex.sets}x${ex.reps}` : ""}
                                {ex.weight ? ` ${ex.weight}kg` : ""}
                              </li>
                            ))}
                          </ul>
                        )}

                        <form
                          onSubmit={addExercise}
                          className="add-exercise-form"
                        >
                          <button type="submit" className="new-routine-btn">
                            Agregar
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="routines-header">
            <button className="new-routine-btn">Administrar rutina</button>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        FitnessApp © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
