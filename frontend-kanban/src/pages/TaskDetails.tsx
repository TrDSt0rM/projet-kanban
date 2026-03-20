import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ChevronLeft, Save, Trash2, MessageSquare, 
  Type, AlignLeft, Send, User 
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export function TaskDetails({ user, onLogout }: { user: any, onLogout: () => void }) {
  const { boardId, taskId } = useParams();
  const navigate = useNavigate();

  // États pour la tâche
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // États pour les commentaires
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchTaskData();
    fetchComments();
  }, [taskId]);

  const fetchTaskData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.ok) {
        const result = await response.json();
        setTask(result.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}/comments`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.ok) {
        const result = await response.json();
        setComments(result.data || []);
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateTask = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          taskName: task.taskName,
          description: task.description,
          priority: task.priority,
          limitDate: task.limitDate
        }),
      });
      if (response.ok) {
        alert("Tâche mise à jour !");
      }
    } catch (err) { alert("Erreur lors de la sauvegarde"); }
    finally { setIsSaving(false); }
  };
    
  const formatDate = (dateString: any) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Date invalide" : date.toLocaleDateString();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message: newComment }), 
      });

      if (response.ok) {
        setNewComment("");
        fetchComments();
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l'ajout:", errorData);
      }
    } catch (err) {
      console.error(err);
    }
  };
    
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;

    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        setComments(comments.filter(c => c.commentId !== commentId));
      } else {
        alert("Erreur lors de la suppression. Vérifiez vos droits.");
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  if (loading || !task) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => navigate(`/board/${boardId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ChevronLeft className="size-5" /> Retour au tableau
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : ÉDITION TÂCHE */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-blue-600">
                <Type className="size-5" />
                <h2 className="font-bold">Détails de la tâche</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Nom de la tâche</label>
                  <input 
                    className="w-full text-xl font-bold p-2 border-b focus:border-blue-500 outline-none transition-colors"
                    value={task.taskName}
                    onChange={(e) => setTask({...task, taskName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                    <AlignLeft className="size-3" /> Description
                  </label>
                  <textarea 
                    className="w-full mt-2 p-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-200 outline-none min-h-[150px]"
                    value={task.description || ""}
                    placeholder="Ajouter une description détaillée..."
                    onChange={(e) => setTask({...task, description: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* SECTION COMMENTAIRES */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-blue-600">
                <MessageSquare className="size-5" />
                <h2 className="font-bold">Commentaires ({comments.length})</h2>
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2 mb-8">
                <input 
                  className="flex-1 bg-slate-50 border-none rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Écrire un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Send className="size-5" />
                </button>
              </form>

              <div className="space-y-4">
                {comments.map((c: any) => (
                  <div key={c.commentId} className="flex gap-3 group"> 
                    <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                      <User className="size-4" />
                    </div>
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl relative text-sm border border-transparent hover:border-slate-200 transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-blue-800">{c.userId || "Anonyme"}</span>
                        
                        {/* Bouton supprimer visible si propriétaire ou admin */}
                        {(c.userId === user.pseudo || user.role === 'ADMIN') && (
                          <button 
                            onClick={() => handleDeleteComment(c.commentId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                      
                      <p className="text-gray-700 whitespace-pre-wrap">{c.message}</p>
                      
                      <div className="mt-2 text-[10px] text-gray-400">
                        {formatDate(c.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : PROPRIÉTÉS & ACTIONS */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Propriétés</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Priorité</label>
                  <select 
                    value={task.priority}
                    onChange={(e) => setTask({...task, priority: e.target.value})}
                    className="w-full p-2 bg-slate-50 rounded-lg border-none outline-none font-medium"
                  >
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Date limite</label>
                  <input 
                    type="date"
                    value={task.limitDate?.split('T')[0] || ""}
                    onChange={(e) => setTask({...task, limitDate: e.target.value})}
                    className="w-full p-2 bg-slate-50 rounded-lg border-none outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleUpdateTask}
                disabled={isSaving}
                className="w-full mt-8 bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
              >
                {isSaving ? "Enregistrement..." : <><Save className="size-5" /> Enregistrer</>}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}