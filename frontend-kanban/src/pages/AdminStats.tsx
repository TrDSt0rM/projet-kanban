import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "../App.tsx";
import { StatsDto, APIResponse } from "../types/mod.ts";
import {
  ArrowLeft,
  Loader2,
  BarChart3,
  Users,
  Layout,
  CheckSquare,
  TrendingUp,
  User as UserIcon
} from "lucide-react";
import { Navbar } from "../components/Navbar.tsx";

interface AdminStatsProps {
  user: User;
  onLogout: () => void;
}

export function AdminStats({ user, onLogout }: AdminStatsProps) {
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Protection de la route
    if (user.role?.toUpperCase() !== "ADMIN") {
      navigate("/dashboard");
    } else {
      fetchStats();
    }
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/admin/stats", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result: APIResponse<StatsDto> = await response.json();

      if (response.ok && result.success) {
        setStats(result.data);
      } else if (!result.success) {
        setError(result.error.message);
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
      setError("Impossible de charger les statistiques depuis le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="size-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Analyse des données en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-6xl mx-auto pt-12 px-4 pb-20">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="size-4 mr-2" />
          Retour au panel Admin
        </button>

        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
            <BarChart3 className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistiques Globales</h1>
            <p className="text-gray-500">Aperçu de l'activité de la plateforme Kanban.</p>
          </div>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 italic">
            {error}
          </div>
        ) : (
          stats && (
            <div className="space-y-8">
              {/* CARTES DE RÉSUMÉ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Utilisateurs" 
                  value={stats.totalUsers} 
                  icon={<Users className="size-6 text-blue-600" />} 
                  color="bg-blue-50" 
                />
                <StatCard 
                  title="Tableaux" 
                  value={stats.totalBoards} 
                  icon={<Layout className="size-6 text-emerald-600" />} 
                  color="bg-emerald-50" 
                />
                <StatCard 
                  title="Tâches" 
                  value={stats.totalTasks} 
                  icon={<CheckSquare className="size-6 text-purple-600" />} 
                  color="bg-purple-50" 
                />
              </div>

              {/* TABLEAU D'ACTIVITÉ PAR UTILISATEUR */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                  <TrendingUp className="size-5 text-gray-400" />
                  <h2 className="font-bold text-gray-800">Activité détaillée par membre</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-bold">Utilisateur</th>
                        <th className="px-6 py-4 font-bold text-center">Tableaux Créés</th>
                        <th className="px-6 py-4 font-bold text-center">Tâches Assignées</th>
                        <th className="px-6 py-4 font-bold text-right">Engagement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stats.userActivity.map((item) => (
                        <tr key={item.pseudo} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserIcon className="size-4 text-gray-400" />
                            </div>
                            <span className="font-semibold text-gray-900">{item.pseudo}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                              {item.boardCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
                              {item.taskCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="w-24 ml-auto bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full" 
                                    style={{ width: `${Math.min(((item.boardCount + item.taskCount) / 10) * 100, 100)}%` }}
                                ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div className={`p-4 ${color} rounded-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}