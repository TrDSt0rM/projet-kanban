import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "@/App";
import { Navbar } from "@/components/Navbar";
import { Layout, Loader2, Plus, User as UserIcon, Crown } from "lucide-react";
// Import du type depuis ton fichier de DTOs
import { BoardSummaryDto } from "@/types/mod";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [boardsList, setBoardsList] = useState<BoardSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
          const result = await response.json();
          if (result.success) {
            setBoardsList(result.data);
          }
        } else {
          console.error("Erreur serveur:", response.status);
        }
      } catch (error) {
        console.error("Erreur réseau lors du chargement des tableaux:", error);
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
            <p className="text-gray-500">Sélectionnez un espace de travail pour collaborer</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="size-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Chargement de vos projets...</p>
          </div>
        ) : boardsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardsList.map((board) => {
              const isOwner = board.ownerPseudo === user.pseudo;
              
              return (
                <div
                  key={board.idBoard}
                  onClick={() => navigate(`/board/${board.idBoard}`)}
                  className="group p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-48"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                      <Layout className="size-6 text-blue-600 group-hover:text-white" />
                    </div>

                    {isOwner ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                        <Crown className="size-3" />
                        Propriétaire
                      </div>
                    ) : (
                      <div className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                        Invité
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {board.boardName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <UserIcon className="size-3.5" />
                      <p className="text-sm">
                        Créé par <span className="font-semibold text-gray-700">{board.ownerPseudo}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                     <span className="text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                       Voir le projet →
                     </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
              <Layout className="size-8 text-gray-300" />
            </div>
            <p className="text-gray-600 font-medium text-lg">Aucun tableau trouvé</p>
            <p className="text-gray-400 mb-6">Commencez par créer votre premier projet ou demandez une invitation.</p>
            <button
              onClick={() => navigate("/dashboard/new")}
              className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              Créer mon premier tableau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}