import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "@/App";
import { Navbar } from "@/components/Navbar";
import { Layout, Loader2, Plus } from "lucide-react";

interface Board {
  id_board: string;
  name: string;
}

interface DashboardProps {
  user: User; // On l'oblige à être présent via la route protégée
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [boardsList, setBoardsList] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Récupérer les tableaux au chargement
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/boards", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBoardsList(data);
        }
      } catch (error) {
        console.error("Erreur chargement boards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, [user.token]);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar user={user} onLogout={onLogout} />

      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Tableaux</h1>
            <p className="text-gray-500">Sélectionnez un espace de travail</p>
          </div>

          <button
            onClick={() => navigate("/dashboard/new")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-100"
          >
            <Plus className="size-5" /> Nouveau
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="size-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">
              Chargement de vos projets...
            </p>
          </div>
        ) : boardsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardsList.map((board) => (
              <div
                key={board.id_board}
                onClick={() => navigate(`/board/${board.id_board}`)}
                className="group p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-40"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                    <Layout className="size-6 text-blue-600 group-hover:text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {board.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Cliquez pour gérer les tâches
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
              <Layout className="size-8 text-gray-300" />
            </div>
            <p className="text-gray-600 font-medium text-lg">
              Aucun tableau trouvé
            </p>
            <p className="text-gray-400 mb-6">
              Commencez par créer votre premier projet.
            </p>
            <button
              onClick={() => navigate("/dashboard/new")}
              className="text-blue-600 font-bold hover:underline"
            >
              Créer un tableau maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
