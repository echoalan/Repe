import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading, isVerifying } = useAuth();

  // 🚫 No renderizar ni redirigir hasta terminar de verificar
  if (isVerifying) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#555",
        }}
      >
        Verificando sesión...
      </div>
    );
  }

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
