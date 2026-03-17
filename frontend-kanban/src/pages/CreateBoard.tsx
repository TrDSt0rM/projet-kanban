import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { User } from "@/App";
import { Navbar } from "@/components/Navbar";
import { LayoutGrid, ArrowLeft, Loader2 } from "lucide-react";

interface CreateBoardProps {
  user: User;
}

export function CreateBoard({ user }: CreateBoardProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: name,
          ownerPseudo: user.pseudo,
        }),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert("Erreur lors de la création du tableau");
      }
    } catch (error) {
      console.error(error);
      alert("Le serveur Tomcat est injoignable");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={() => navigate("/login")} />

      <div className="max-w-2xl mx-auto pt-16 px-4">
        <button
          onClick={() => navigate(-1)}
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
                Nouveau projet
              </h1>
              <p className="text-gray-500 text-sm">
                Donnez un nom à votre espace de travail.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du tableau
              </label>
              <input
                type="text"
                placeholder="Ex: Refonte Site Web, Projet M1..."
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
                {isLoading && <Loader2 className="size-4 animate-spin" />}
                {isLoading ? "Création..." : "Créer le tableau"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-700">
            <strong>Note :</strong> Par défaut, trois colonnes seront créées :{" "}
            <em>À faire</em>, <em>En cours</em> et <em>Terminé</em>.
          </div>
          <div className="p-4 bg-gray-100/50 border border-gray-200 rounded-xl text-xs text-gray-600">
            Vous pourrez inviter d'autres membres une fois le tableau créé.
          </div>
        </div>
      </div>
    </div>
  );
}
