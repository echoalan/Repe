import React, { useEffect, useState } from "react";

const styles = `
:root {
  --bg: #0f1116;
  --card: #121318;
  --muted: #9ca3af;
  --accent: #00d1b2;
  --accent-2: #384d96;
  --glass: rgba(255,255,255,0.03);
  --radius: 14px;
}
*{box-sizing:border-box}
html,body,#root{height:100%}
body {
  background: linear-gradient(180deg,#0d0f13 0%, #0f1116 60%);
  font-family:'Segoe UI', Roboto, sans-serif;
  color:#e6eef2;
  margin:0;
  display:flex;
  justify-content:center;
}
.container {
  max-width:1000px;
  margin:0 auto;
  padding:32px;
}
.header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  flex-wrap:wrap;
}
.logo {
  display:flex;
  align-items:center;
  gap:12px;
}
.logo-circle {
  height:44px;
  width:44px;
  border-radius:10px;
  background:linear-gradient(135deg,var(--accent),#059669);
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  color:#041014;
}
.app-title {
  font-size:1.1rem;
  font-weight:600;
}
.header-actions {
  display:flex;
  gap:10px;
  align-items:center;
  flex-wrap:wrap;
}
.cta-btn {
  background:linear-gradient(135deg,var(--accent),#059669);
  border:none;
  padding:10px 14px;
  border-radius:10px;
  color:#02110f;
  font-weight:700;
  cursor:pointer;
  box-shadow:0 8px 24px rgba(0,0,0,0.5);
}
.secondary-btn {
  background:transparent;
  border:1px solid rgba(255,255,255,0.06);
  padding:8px 12px;
  border-radius:10px;
  color:var(--muted);
  cursor:pointer;
}
.hero {
  margin-top:40px;
  display:flex;
  flex-direction:column;
  align-items:center;
}
.hero-card {
  width:100%;
  background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
  padding:32px;
  border-radius:var(--radius);
  box-shadow:0 6px 24px rgba(3,7,12,0.6);
  border:1px solid rgba(255,255,255,0.03);
}
.hero h1 {
  margin:0 0 8px;
  font-size:1.8rem;
  line-height:1.3;
}
.lead {
  color:var(--muted);
  margin-bottom:18px;
  font-size:1rem;
}
.features {
  display:flex;
  flex-direction:column;
  gap:12px;
  margin-top:16px;
}
.feature {
  display:flex;
  gap:12px;
  align-items:flex-start;
}
.feature-badge {
  min-width:44px;
  height:44px;
  border-radius:10px;
  background:var(--glass);
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  color:var(--accent);
}
.feature h4 {
  margin:0;
  font-size:0.95rem;
}
.feature p {
  margin:4px 0 0;
  color:var(--muted);
  font-size:0.9rem;
}
.install-panel {
  background:linear-gradient(90deg, rgba(0,209,178,0.06), rgba(56,77,150,0.03));
  padding:16px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,0.03);
  display:flex;
  flex-direction:column;
  gap:10px;
}
.badge {
  background:rgba(255,255,255,0.04);
  padding:6px 8px;
  border-radius:8px;
  font-size:0.8rem;
  color:var(--muted);
}
.cta-row {
  display:flex;
  gap:10px;
  margin-top:18px;
  flex-wrap:wrap;
}
.footer {
  margin-top:60px;
  text-align:center;
  color:var(--muted);
  font-size:0.9rem;
  padding:28px;
  border-top:1px solid rgba(255,255,255,0.05);
}
@media(max-width:780px) {
  .hero-card {
    padding:24px;
  }
  .hero h1 {
    font-size:1.4rem;
  }
}
`;

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    function onAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      document.head.removeChild(styleTag);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice && choice.outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="container">
        <header className="header">
          <div className="logo">
            <div className="logo-circle">FF</div>
            <div>
              <div className="app-title">FitFlow</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Entrena. Registra. Repite.
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button className="secondary-btn">Características</button>
            <button className="secondary-btn">Soporte</button>
            <button
              className="cta-btn"
              onClick={() =>
                window.scrollTo({ top: 800, behavior: "smooth" })
              }
            >
              Descargar PWA
            </button>
          </div>
        </header>

        <main className="hero">
          <section className="hero-card">
            <h1>Tu bitácora de entrenamiento — siempre disponible</h1>
            <p className="lead">
              Registra series, repeticiones y pesos. Revive tus sesiones
              anteriores y mejora semana a semana. PWA instalable, offline y
              ligera.
            </p>

            <div className="features">
              <div className="feature">
                <div className="feature-badge">⏱</div>
                <div>
                  <h4>Timer integrado</h4>
                  <p>
                    Descansa con precisión entre series, controla tus tiempos
                    desde la app.
                  </p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-badge">📦</div>
                <div>
                  <h4>Soporte offline</h4>
                  <p>
                    Tu historial y rutinas disponibles aún sin conexión.
                  </p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-badge">🔒</div>
                <div>
                  <h4>Privacidad</h4>
                  <p>
                    Tus datos están en tu dispositivo y en tu cuenta cuando
                    quieras sincronizar.
                  </p>
                </div>
              </div>
            </div>

            <div className="cta-row">
              <button className="cta-btn" onClick={promptInstall}>
                {installed
                  ? "Instalado ✅"
                  : deferredPrompt
                  ? "Instalar App"
                  : "Añadir a inicio"}
              </button>
              <button
                className="secondary-btn"
                onClick={() =>
                  alert("Enlace de APK / Play Store (ejemplo)")
                }
              >
                Descargar APK
              </button>
            </div>

            <div style={{ marginTop: 18 }} className="install-panel">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>¿Cómo instalar?</strong>
                  <div
                    style={{ fontSize: 13, color: "var(--muted)" }}
                  >
                    Presiona "Instalar App" o usa el menú del navegador
                    (Agregar a pantalla de inicio).
                  </div>
                </div>
                <div className="badge">PWA</div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          © {new Date().getFullYear()} 
        </footer>
      </div>
    </div>
  );
}
