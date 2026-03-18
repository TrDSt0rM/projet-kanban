import { useState } from "react";
import { User } from "@/App";
import { Navbar } from "@/components/Navbar";
import {
  User as UserIcon,
  Lock,
  Save,
  AlertCircle,
  Loader2,
  ShieldCheck,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router";

export function Profile({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const navigate = useNavigate();

  // Fonction pour mettre à jour UNIQUEMENT le mot de passe
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!password.trim()) {
      setMessage({
        type: "error",
        text: "Veuillez saisir un nouveau mot de passe.",
      });
      return;
    }

    if (!user.token) {
      setMessage({
        type: "error",
        text: "Session invalide. Veuillez vous reconnecter.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // CORRECTION : L'URL pointait vers /password (404), on utilise la route PUT /users/:pseudo
      const response = await fetch(
        `http://localhost:8000/users/${user.pseudo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            password: password,
          }),
        },
      );

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Mot de passe mis à jour ! Reconnexion obligatoire...",
        });
        // On force la déconnexion après 2.5 secondes
        setTimeout(onLogout, 2500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage({
          type: "error",
          text: errorData.message || `Erreur serveur (${response.status})`,
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Le serveur Deno est injoignable." });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer le compte
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera toutes vos données.",
    );

    if (!confirmed) return;
    if (!user.token) return;

    setIsDeleting(true);
    setMessage(null);

    try {
      // Requête DELETE à Deno (port 8000)
      const response = await fetch(
        `http://localhost:8000/users/${user.pseudo}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (response.ok) {
        // Suppression réussie -> déconnexion et retour à l'accueil
        alert("Votre compte a été supprimé avec succès.");
        onLogout();
        navigate("/");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage({
          type: "error",
          text:
            errorData.message ||
            `Erreur lors de la suppression (${response.status})`,
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Le serveur Deno est injoignable." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-xl mx-auto pt-12 px-4 pb-12">
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-6">
          <div className="bg-blue-600 p-8 text-white">
            <h1 className="text-2xl font-bold text-center">Mon Profil</h1>
          </div>

          <div className="p-8 space-y-8">
            {message && (
              <div
                className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-in fade-in duration-300 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                <AlertCircle className="size-4 shrink-0" />
                {message.text}
              </div>
            )}

            {/* Section Informations de Compte (Lecture seule) */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Informations du compte
              </h2>
              <div>
                <label className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <UserIcon className="size-4 text-gray-400" /> Pseudo
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-100 border rounded-xl text-gray-700 font-medium outline-none cursor-not-allowed"
                  value={user.pseudo}
                  disabled // <-- Verrouillé
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <ShieldCheck className="size-4 text-gray-400" /> Rôle
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-100 border rounded-xl text-gray-700 font-medium outline-none cursor-not-allowed"
                  value={user.role}
                  disabled // <-- Verrouillé
                />
              </div>
            </div>

            {/* Section Modification Mot de Passe */}
            <form
              onSubmit={handleUpdatePassword}
              className="space-y-6 pt-4 border-t"
            >
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="size-4 text-gray-400" /> Nouveau mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Saisissez votre nouveau mot de passe"
                  className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Save className="size-5" />
                )}
                {isLoading
                  ? "Enregistrement..."
                  : "Mettre à jour le mot de passe"}
              </button>
            </form>
          </div>
        </div>

        {/* Section Suppression de Compte */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
          <div className="bg-red-50 p-6 border-b border-red-100">
            <h2 className="text-lg font-semibold text-red-900 flex items-center gap-2">
              <UserX className="size-5" /> SUPPRESSION
            </h2>
            <p className="text-red-700 text-sm mt-1">
              Cette action supprimera définitivement votre compte et toutes vos
              données (tableaux, tâches).
            </p>
          </div>
          <div className="p-6 bg-red-50/50">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-100"
            >
              {isDeleting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <UserX className="size-5" />
              )}
              {isDeleting
                ? "Suppression en cours..."
                : "Supprimer définitivement mon compte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
