import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { User } from "@/App";
import { Navbar } from "@/components/Navbar";
import { LayoutGrid, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

interface CreateBoardProps {
  user: User;
  onLogout: () => void;
}

export function CreateBoard({ user, onLogout }: CreateBoardProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          boardName: name.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setError(
          data.message ||
            data.error?.message ||
            "Erreur lors de la création du tableau.",
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Impossible de joindre le serveur de gestion (Deno).");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-2xl mx-auto pt-16 px-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="size-4 mr-2" />
          Retour au dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <LayoutGrid className="size-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nouveau tableau
              </h1>
              <p className="text-gray-500 text-sm">
                Créez un nouvel espace vide pour vos tâches.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2">
              <AlertCircle className="size-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du tableau
              </label>
              <input
                type="text"
                placeholder="Ex: Projet de fin d'études..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 px-6 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  "Créer le tableau"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
