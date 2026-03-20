import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { User } from "../App.tsx";
import { Navbar } from "../components/Navbar.tsx";
import { 
  History, 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  Activity,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { ActionLogDto, PageableActionLogDto } from "../types/mod.ts";

interface LogsProps {
  user: User;
  onLogout: () => void;
}

export function Logs({ user, onLogout }: LogsProps) {
  const { boardId, taskId } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState<PageableActionLogDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getEndpoint = () => {
    const baseUrl = "http://localhost:8000";
    if (taskId) return `${baseUrl}/tasks/${taskId}/logs`;
    if (boardId) return `${baseUrl}/boards/${boardId}/logs`;
    return `${baseUrl}/admin/logs`;
  };

  useEffect(() => {
    if (user.role?.toUpperCase() !== "ADMIN") {
      navigate("/dashboard");
    } else {
      fetchLogs();
    }
  }, [user, navigate, page, boardId, taskId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL(getEndpoint());
      url.searchParams.set("page", page.toString());
      url.searchParams.set("size", "10");

      const response = await fetch(url.toString(), {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json"
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setData(result.data);
      } else {
        setError(result.error?.message || "Erreur lors de la récupération des logs.");
      }
    } catch (err) {
      console.error("Fetch logs error:", err);
      setError("Le serveur est injoignable.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getActionStyle = (type: string) => {
    if (type.includes("CREATED")) return "bg-green-100 text-green-700 border-green-200";
    if (type.includes("DELETED")) return "bg-red-100 text-red-700 border-red-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  // Titre dynamique pour l'en-tête
  const getLogTitle = () => {
    if (taskId) return "Logs de la Tâche";
    if (boardId) return "Logs du Tableau";
    return "Logs Système Globaux";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-4xl mx-auto p-6">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" /> Retour
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg text-white shadow-md">
                <History className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {getLogTitle()}
                </h1>
                <p className="text-xs text-gray-500 font-mono">
                  {taskId ? `TASK: ${taskId}` : boardId ? `BOARD: ${boardId}` : "ADMIN_SCOPE"}
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-600 size-10 mb-4" />
                <p className="text-gray-400">Chargement des données sécurisées...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-500 px-6 text-center">
                <ShieldAlert className="size-12 mb-4 opacity-20" />
                <p className="font-bold">{error}</p>
              </div>
            ) : data?.content && data.content.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {data.content.map((log: ActionLogDto) => (
                  <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-full border ${getActionStyle(log.actionType)}`}>
                        <Activity className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getActionStyle(log.actionType)}`}>
                            {log.actionType}
                          </span>
                          <span className="text-sm font-bold text-gray-700">
                            {log.userPseudo || "Utilisateur Inconnu"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="size-3" /> {formatDate(log.datetime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p>Aucun log enregistré pour cet élément.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-6">
              <button
                type="button"
                disabled={data.first}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1 text-sm font-bold text-gray-500 disabled:opacity-20 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="size-4" /> Précédent
              </button>
              <span className="text-xs font-mono bg-white border px-3 py-1 rounded-md shadow-sm">
                {data.currentPage + 1} / {data.totalPages}
              </span>
              <button
                type="button"
                disabled={data.last}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1 text-sm font-bold text-gray-500 disabled:opacity-20 hover:text-blue-600 transition-colors"
              >
                Suivant <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}