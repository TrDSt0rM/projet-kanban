import { useEffect, useState } from "react";
import { User } from "@/App";
import { InvitationDto } from "@/types/mod";
import { Check, X, Bell, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function Invitations({ user }: { user: User }) {
  const [invitations, setInvitations] = useState<InvitationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInvitations = async () => {
    try {
      const response = await fetch("http://localhost:8000/invitations", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const result = await response.json();
      if (result.success) setInvitations(result.data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInvitations(); }, []);

  const handleAction = async (boardId: string, action: 'accept' | 'decline') => {
    // Note: Pour decline, ton router Deno utilise DELETE /invitations/:boardId
    const url = action === 'accept' 
      ? `http://localhost:8000/invitations/${boardId}/accept` 
      : `http://localhost:8000/invitations/${boardId}`;
    
    const method = action === 'accept' ? 'POST' : 'DELETE';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.ok) {
        // On retire l'invitation de la liste locale
        setInvitations(prev => prev.filter(i => i.idBoard !== boardId));
      }
    } catch (error) {
      console.error("Erreur action:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" /> Retour au Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="size-6 text-blue-600" />
              Invitations Reçues
            </h1>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
              {invitations.length}
            </span>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : invitations.length > 0 ? (
              <div className="space-y-4">
                {invitations.map((inv) => (
                  <div key={inv.idBoard} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-bold text-gray-800">{inv.boardName}</h3>
                      <p className="text-sm text-gray-500">Invité par <span className="font-medium text-blue-600">@{inv.ownerPseudo}</span></p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAction(inv.idBoard, 'accept')}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                      >
                        <Check className="size-4" /> Accepter
                      </button>
                      <button 
                        onClick={() => handleAction(inv.idBoard, 'decline')}
                        className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      >
                        <X className="size-4" /> Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>Aucune invitation en attente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}