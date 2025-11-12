import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ExerciseHistoryModal({ history, exerciseName, onClose }) {
  const [groupedHistory, setGroupedHistory] = useState({});
  const [summary, setSummary] = useState({});


      useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []); 


  useEffect(() => {
    if (!history?.length) return;



    // Agrupar por fecha (más legible)
    const grouped = history.reduce((acc, log) => {
      const date = new Date(log.workout.date).toLocaleDateString("es-AR", {
        weekday: "long",
        day: "2-digit",
        month: "short",
      });
      acc[date] = acc[date] || [];
      acc[date].push(log);
      return acc;
    }, {});
    setGroupedHistory(grouped);

    // Calcular resumen
    const allWeights = history.map(h => h.weight_used || 0);
    const allReps = history.map(h => h.reps_done || 0);
    const totalReps = allReps.reduce((a, b) => a + b, 0);
    const maxWeight = Math.max(...allWeights);
    const avgReps = (totalReps / history.length).toFixed(1);

    setSummary({
      sesiones: new Set(history.map(h => h.workout.date)).size,
      maxWeight,
      avgReps,
    });
  }, [history]);

  const chartData = Object.entries(groupedHistory).map(([date, logs]) => ({
    date,
    pesoPromedio:
      logs.reduce((sum, l) => sum + (l.weight_used || 0), 0) / logs.length,
    repPromedio:
      logs.reduce((sum, l) => sum + (l.reps_done || 0), 0) / logs.length,
  }));

  if (!history?.length) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="exercise-history-modal"
        onClick={e => e.stopPropagation()}
        
      >
        <h2 style={{ marginBottom: "12px" }}>Historial — {exerciseName}</h2>

        {Object.entries(groupedHistory).map(([date, logs]) => (
          <div key={date} style={{ marginBottom: "12px" }}>
            <h4 style={{ textTransform: "capitalize", color: "#4f46e5" }}>{date}</h4>
            <ul style={{ marginLeft: "12px" }}>
              {logs.map(l => (
                <li key={l.id} style={{ marginBottom: "4px" }}>
                  Serie {l.set_number}: {l.reps_done} reps ×{" "}
                  {l.weight_used ?? "-"} kg{" "}
                  {l.notes && <em style={{ color: "#666" }}>({l.notes})</em>}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <hr style={{ margin: "16px 0" }} />

        <div style={{ fontSize: "0.95rem", color: "#333" }}>
          <p>📅 Sesiones: <strong>{summary.sesiones}</strong></p>
          <p>🏋️ Peso máximo: <strong>{summary.maxWeight} kg</strong></p>
          <p>🔁 Promedio de repeticiones: <strong>{summary.avgReps}</strong></p>
        </div>

        {chartData.length >= 1 && (
          <div style={{ marginTop: "16px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pesoPromedio" stroke="#4f46e5" strokeWidth={2} />
                <Line type="monotone" dataKey="repPromedio" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "16px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
