import { User } from "@/App";
import { Navbar } from "@/components/Navbar";

interface Board {
  id_board: string;
  name: string;
}

interface DashboardProps {
  boards: Board[];
  user: User | null;
}

export function Dashboard({ boards, user }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar user={null} />

      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Bienvenue, {user?.pseudo || "Utilisateur"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div
              key={board.id_board}
              className="p-6 bg-white border rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-bold">{board.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
