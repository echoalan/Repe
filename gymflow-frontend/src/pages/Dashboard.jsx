import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import RoutineCard from "../components/RoutineCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [loading, setLoading] = useState(true);


  const API_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
      return;
    }
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    const token = localStorage.getItem("token");
    setLoading(true); // empieza la carga
    try {
      const res = await fetch(`${API_URL}/routines`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRoutines(data);
      } else {
        console.error("Error al obtener rutinas");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false); // termina la carga
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <Header logout={logout} />
      <main className="dashboard-main">
        <section className="routines-section">
          <h2 className="titleApp">Tu rutina</h2>
          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p>Cargando rutinas...</p>
            </div>
          ) : routines.length === 0 ? (
            <p className="no-routines">Aún no tienes rutinas registradas.</p>
          ) : (
            <div className="routines-grid">
              {routines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  selectedRoutine={selectedRoutine}
                  setSelectedRoutine={setSelectedRoutine}
                  user={user}
                />
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
