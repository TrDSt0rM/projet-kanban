import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useState } from "react";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { CreateBoard } from "./pages/CreateBoard.tsx";
import { Profile } from "./pages/Profile.tsx";
import { Admin } from "./pages/Admin.tsx";
import { BoardDetail } from "./pages/BoardDetail.tsx";
import { Invitations } from "./pages/Invitation.tsx";
import { TaskDetails } from "./pages/TaskDetails.tsx";
import { AdminStats } from "./pages/AdminStats.tsx";
import { Logs } from "./pages/Logs.tsx";

export interface User {
  pseudo: string;
  role: "ADMIN" | "USER" | "MANAGER";
  token: string;
}

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("kanban_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.token) return null;
        return parsed;
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
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
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/board/:boardId"
          element={
            user ? (
              <BoardDetail user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard/new"
          element={
            user ? (
              <CreateBoard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/admin"
          element={
            user && user.role === "ADMIN" ? (
              <Admin user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/invitations"
          element={
            user ? (
              <Invitations user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/board/:boardId/tasks/:taskId"
          element={
            user ? (
              <TaskDetails user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/admin/stats"
          element={
            user && user.role === "ADMIN" ? (
              <AdminStats user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

      <Route
        path="/board/:boardId/logs"
        element={
          user && user.role === "ADMIN" ? (
            <Logs user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      <Route
        path="/admin/logs"
        element={
          user && user.role === "ADMIN" ? (
            <Logs user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;