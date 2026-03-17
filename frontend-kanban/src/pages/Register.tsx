import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router";

export function Register() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });

      if (response.ok) {
        alert("Compte créé ! Connectez-vous.");
        navigate("/login");
      } else {
        const err = await response.json();
        alert(err.error?.message || "Erreur lors de l'inscription.");
      }
    } catch {
      alert("Erreur serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-xl rounded-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-green-600">
          Inscription
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Pseudo"
            className="w-full p-3 border rounded-lg"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-bold"
          >
            {isLoading ? "Création..." : "Créer mon compte"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm">
          Déjà inscrit ?{" "}
          <Link to="/login" className="text-blue-600 font-bold">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
