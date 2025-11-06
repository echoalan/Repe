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
        <h2>¡Hola, {user.name.split(" ")[0]}! 👋</h2>

        <section className="routines-section">
          <div className="routines-header">
            <h3>Tus rutinas</h3>
            <button className="new-routine-btn">+ Nueva rutina</button>
          </div>

          {routines.length === 0 ? (
            <p className="no-routines">Aún no tienes rutinas registradas.</p>
          ) : (
            <div className="routines-grid">
              {routines.map((routine) => (
                <div key={routine.id} className="routine-card">
                  <h4>{routine.day_of_week}</h4>
                  <h3>{routine.name}</h3>

                  <div className="containerVerExercises">
                    <button
                      className="see-exercises-btn"
                      onClick={() =>
                        selectedRoutine === routine.id
                          ? setSelectedRoutine(null)
                          : fetchExercises(routine.id)
                      }
                    >
                      {selectedRoutine === routine.id
                        ? "Ocultar"
                        : "Ver ejercicios"}
                    </button>
                  </div>

                  {/* Sección expandible */}
                  <div
                    className={`exercises-dropdown ${
                      selectedRoutine === routine.id ? "open" : ""
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
                                <strong>{ex.name}</strong>{" "}
                                <span className="reps">{ex.reps} reps</span>
                                <span>{ex.weight}Kg</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <form
                          onSubmit={addExercise}
                          className="add-exercise-form"
                        >
                          <input
                            type="text"
                            placeholder="Nombre del ejercicio"
                            value={newExercise.name}
                            onChange={(e) =>
                              setNewExercise({
                                ...newExercise,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                          <input
                            type="number"
                            placeholder="Reps"
                            value={newExercise.reps}
                            onChange={(e) =>
                              setNewExercise({
                                ...newExercise,
                                reps: e.target.value,
                              })
                            }
                            required
                          />
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
        </section>
      </main>

      <footer className="dashboard-footer">
        FitnessApp © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
