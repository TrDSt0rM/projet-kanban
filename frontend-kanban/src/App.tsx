import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useState } from "react";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";

export interface User {
  pseudo: string;
  role: "ADMIN" | "USER" | "MANAGER";
}

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("kanban_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem("kanban_user", JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("kanban_user");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login onLogin={handleLogin} user={user} />}
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard boards={[]} user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
