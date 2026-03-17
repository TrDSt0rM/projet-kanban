import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { User } from "../App";

interface LoginProps {
  onLogin: (user: User) => void;
  user: User | null;
}

export function Login({ onLogin, user }: LoginProps) {
  const [pseudo, setPseudo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // CORRECTIF : On fusionne l'user et le token pour App.tsx
        const userWithToken: User = {
          ...result.data.user,
          token: result.data.token, // On récupère le token au bon endroit
        };

        onLogin(userWithToken);
        navigate("/dashboard");
      } else {
        alert(result.error?.message || "Identifiants incorrects.");
      }
    } catch (error) {
      alert("Le serveur Deno est injoignable.");
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
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Connexion
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Pseudo"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Pas de compte ?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            S'inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}
