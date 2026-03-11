import { useState, FormEvent } from 'react';

interface User {
    pseudo: string;
    role: string;
}

interface LoginProps {
    onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [pseudo, setPseudo] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pseudo, password }),
            });

            if (response.ok) {
                const data = await response.json();
                onLogin(data.user);
            } else {
                alert("Identifiants incorrects ou compte désactivé");
            }
        } catch (error) {
            console.error("Erreur de connexion au serveur Deno:", error);
            alert("Le serveur de sécurité (Deno) est injoignable.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion Kanban</h2>
                <input
                    type="text"
                    placeholder="Pseudo"
                    className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPseudo(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
}