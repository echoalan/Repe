import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast"; // <-- import
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Contenedor global de los toasts */}
        <Toaster position="top-right" reverseOrder={false} />
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
