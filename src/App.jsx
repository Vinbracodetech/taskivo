import { useState } from "react";
import CSS from "./styles/global.js";
import Landing from "./pages/Landing.jsx";

export default function App() {
  const [view, setView] = useState("landing");
  const [authMode, setAuthMode] = useState("login");

  function navigate(v) {
    setView(v);
    window.scrollTo(0, 0);
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        <div className="main-content" style={{ marginLeft: 0 }}>
          {view === "landing" && (
            <Landing navigate={navigate} setAuthMode={setAuthMode} />
          )}
          {/* We will add Auth and Dashboard back once Landing is confirmed working */}
        </div>
      </div>
    </>
  );
}
