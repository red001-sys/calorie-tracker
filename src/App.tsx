import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Alimentar from "./pages/Alimentar";
import Feed from "./pages/Feed";
import Profissionais from "./pages/Profissionais";
import Perfil from "./pages/Perfil";
import Ajustes from "./pages/Ajustes";
import BottomNav from "./components/BottomNav";
import { checkStreak } from "./lib/gamification";

export default function App() {
  const [onboarded, setOnboarded] = useState(
    !!localStorage.getItem("userName")
  );

  useEffect(() => {
    if (onboarded) checkStreak();
  }, [onboarded]);

  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen text-white max-w-md mx-auto relative pb-20">
        {!onboarded ? (
          <Onboarding onComplete={() => setOnboarded(true)} />
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/alimentar" element={<Alimentar />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profissionais" element={<Profissionais />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/ajustes" element={<Ajustes />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <BottomNav />
          </>
        )}
      </div>
    </BrowserRouter>
  );
}
