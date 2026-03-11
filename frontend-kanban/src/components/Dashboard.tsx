interface Board {
  id_board: string;
  name: string;
}

interface DashboardProps {
  boards: Board[];
}

export default function Dashboard({ boards }: DashboardProps) {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Mes Tableaux
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div
              key={board.id_board}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
            >
              <h3 className="text-lg font-bold text-gray-700">{board.name}</h3>
              <p className="text-gray-500 text-sm mt-2">
                Cliquez pour consulter le tableau
              </p>
            </div>
          ))}

          <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-all">
            <span className="text-3xl font-light">+</span>
            <span className="text-sm font-medium mt-1">Nouveau Tableau</span>
          </button>
        </div>
      </div>
    </div>
  );
}
