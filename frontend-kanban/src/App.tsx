import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useState } from "react";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";

export interface User {
  pseudo: string;
  role: "ADMIN" | "USER" | "MANAGER";
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    console.log("Utilisateur connecté avec succès :", loggedUser);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={<Dashboard boards={[]} user={user} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
