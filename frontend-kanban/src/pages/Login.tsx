import { useState, FormEvent } from "react";
import { User } from "../App";

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [pseudo, setPseudo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // On choisit l'URL en fonction du mode (login ou register)
    const endpoint = isRegistering ? "/auth/register" : "/auth/login";

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });

      if (response.ok) {
        if (isRegistering) {
          alert(
            "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
          );
          setIsRegistering(false); // On repasse en mode login
        } else {
          const data = await response.json();
          onLogin(data.user);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Le serveur Deno est injoignable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-xl rounded-xl w-full max-w-md transition-all"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900">
          {isRegistering ? "Créer un compte" : "Connexion Kanban"}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {isRegistering
            ? "Rejoignez l'équipe pour gérer vos projets"
            : "Ravi de vous revoir !"}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pseudo
            </label>
            <input
              type="text"
              placeholder="Votre identifiant"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transform active:scale-95 transition-all ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading
              ? "Chargement..."
              : isRegistering
                ? "S'inscrire"
                : "Se connecter"}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            {isRegistering ? "Déjà un compte ?" : "Pas encore de compte ?"}
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-2 text-blue-600 font-bold hover:underline"
            >
              {isRegistering ? "Se connecter" : "S'inscrire gratuitement"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
