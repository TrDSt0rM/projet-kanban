import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "@/App";
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface AdminProps {
  user: User;
  onLogout: () => void;
}

export function Admin({ user, onLogout }: AdminProps) {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Sécurité : si pas admin, on dégage
  useEffect(() => {
    if (user.role?.toLowerCase() !== "admin") {
      navigate("/dashboard");
    } else {
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/admin/all", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsersList(data);
      } else {
        setError(
          data.message || "Erreur lors de la récupération des utilisateurs",
        );
      }
    } catch (err) {
      setError("Impossible de joindre le serveur Deno.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (
    targetPseudo: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/users?pseudo=${targetPseudo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        },
      );

      if (response.ok) {
        // Mise à jour locale de la liste pour l'affichage
        setUsersList((prev) =>
          prev.map((u) =>
            u.pseudo === targetPseudo ? { ...u, isActive: !currentStatus } : u,
          ),
        );
      }
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-5xl mx-auto pt-16 px-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="size-4 mr-2" />
          Retour au dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-50 rounded-lg">
              <ShieldCheck className="size-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel Administration
              </h1>
              <p className="text-gray-500 text-sm">
                Gérez les accès des utilisateurs du Kanban.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-400 text-sm">
                    <th className="pb-4 font-medium">Utilisateur</th>
                    <th className="pb-4 font-medium">Rôle</th>
                    <th className="pb-4 font-medium">Statut</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {usersList.map((u) => (
                    <tr key={u.pseudo} className="group">
                      <td className="py-4 font-semibold text-gray-900">
                        {u.pseudo}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${u.role === "admin" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4">
                        {u.isActive ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                            <UserCheck className="size-4" /> Actif
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400 text-sm font-medium">
                            <UserX className="size-4" /> Inactif
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {u.pseudo !== user.pseudo && (
                          <button
                            onClick={() =>
                              handleToggleStatus(u.pseudo, u.isActive)
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                              u.isActive
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {u.isActive ? "Désactiver" : "Activer"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
