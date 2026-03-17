import { User } from "@/App";
import { Navbar } from "@/components/Navbar";

interface Board {
  id_board: string;
  name: string;
}

interface DashboardProps {
  boards: Board[];
  user: User | null;
  onLogout: () => void;
}

export function Dashboard({ boards, user, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* On passe l'utilisateur et la fonction logout à la Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl px-5 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
            Bienvenue, {user?.pseudo || "Utilisateur"}
          </h2>
        </div>

        {boards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {boards.map((board) => (
              <div
                key={board.id_board}
                className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-bold text-gray-700">
                  {board.name}
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  Cliquez pour ouvrir
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">Vous n'avez pas encore de tableau.</p>
            <p className="text-sm text-gray-400">
              Créez-en un pour commencer !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
