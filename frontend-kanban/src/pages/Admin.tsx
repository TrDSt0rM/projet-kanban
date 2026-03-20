import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "@/App";
import { UserDto, APIResponse } from "../types/mod.ts";
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  UserPlus,
  Lock,
  BarChart3,
  ClipboardList
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface AdminProps {
  user: User;
  onLogout: () => void;
}

export function Admin({ user, onLogout }: AdminProps) {
  const [usersList, setUsersList] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role?.toUpperCase() !== "ADMIN") {
      navigate("/dashboard");
    } else {
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/admin/users", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      const result: APIResponse<UserDto[]> = await response.json();
      
      if (response.ok && result.success) {
        setUsersList(result.data);
      } else if (!result.success) {
        setError(result.error.message);
      }
    } catch (err) {
      setError("Impossible de joindre le serveur Deno.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (targetPseudo: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/users/${targetPseudo}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ active: !currentStatus }), 
      });

      if (response.ok) {
        setUsersList((prev) =>
          prev.map((u) =>
            u.pseudo === targetPseudo ? { ...u, active: !currentStatus } : u
          )
        );
      }
    } catch (err) {
      alert("Erreur lors de la modification du statut");
    }
  };

  const handlePromoteAdmin = async (targetPseudo: string) => {
    if (!confirm(`Voulez-vous vraiment promouvoir ${targetPseudo} Administrateur ?`)) return;

    try {
      const response = await fetch(`http://localhost:8000/admin/users/${targetPseudo}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ role: "ADMIN" }),
      });

      if (response.ok) {
        setUsersList((prev) =>
          prev.map((u) =>
            u.pseudo === targetPseudo ? { ...u, role: "ADMIN" } : u
          )
        );
      }
    } catch (err) {
      alert("Erreur lors de la promotion");
    }
  };

  const handleDeleteUser = async (targetPseudo: string) => {
    if (!confirm(`Action irréversible : Supprimer ${targetPseudo} ?`)) return;

    try {
      const response = await fetch(`http://localhost:8000/admin/users/${targetPseudo}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        setUsersList((prev) => prev.filter((u) => u.pseudo !== targetPseudo));
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-5xl mx-auto pt-16 px-4 pb-20">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="size-4 mr-2" />
          Retour au dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
  <div className="flex items-center gap-3">
    <div className="p-3 bg-purple-50 rounded-lg">
      <ShieldCheck className="size-6 text-purple-600" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Panel Administration</h1>
      <p className="text-gray-500 text-sm">Gérez les accès et les rôles des utilisateurs.</p>
    </div>
  </div>

  {/* Groupe de boutons d'action */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => navigate("/admin/logs")}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium text-sm"
    >
      <ClipboardList className="size-4" />
      Logs système
    </button>

    <button
      onClick={() => navigate("/admin/stats")}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm font-medium text-sm"
    >
      <BarChart3 className="size-4" />
      Voir les statistiques
    </button>
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
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-400 text-sm">
                    <th className="pb-4 font-medium">Utilisateur</th>
                    <th className="pb-4 font-medium">Rôle</th>
                    <th className="pb-4 font-medium">Statut</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {usersList.map((u) => {
                    const isAdmin = u.role.toUpperCase() === "ADMIN";
                    const isSelf = u.pseudo === user.pseudo;

                    return (
                      <tr key={u.pseudo} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-semibold text-gray-900">{u.pseudo} {isSelf && "(Vous)"}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4">
                          {u.active ? (
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
                          {isAdmin ? (
                            <div className="flex items-center justify-end gap-1 text-gray-400 text-xs italic">
                              <Lock className="size-3" /> Protégé
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleToggleStatus(u.pseudo, u.active)}
                                title={u.active ? "Désactiver" : "Activer"}
                                className={`p-2 rounded-lg transition-colors ${
                                  u.active ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                                }`}
                              >
                                {u.active ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                              </button>

                              <button
                                onClick={() => handlePromoteAdmin(u.pseudo)}
                                title="Promouvoir Admin"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <UserPlus className="size-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u.pseudo)}
                                title="Supprimer"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}