import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
// On importe les bons noms exportés par ton fichier interfaces-dtos.ts
import { TaskDetailDto, CommentDto } from "../types/interfaces-dtos";

export const TaskDetails = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    
    const [task, setTask] = useState<TaskDetailDto | null>(null);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getPriorityStyle = (priority: string | null) => {
        if (!priority) return "bg-gray-100 text-gray-700 border-gray-200";
        switch (priority.toLowerCase()) {
            case 'high': return "bg-red-100 text-red-700 border-red-200";
            case 'medium': return "bg-amber-100 text-amber-700 border-amber-200";
            case 'low': return "bg-emerald-100 text-emerald-700 border-emerald-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const fetchData = async () => {
        if (!taskId) return;
        setLoading(true);
        try {
            const savedUser = localStorage.getItem("kanban_user");
            const user = savedUser ? JSON.parse(savedUser) : null;
            const headers = {
                "X-User-Pseudo": user?.pseudo || "",
                "Authorization": `Bearer ${user?.token || ""}`,
                "Content-Type": "application/json"
            };

            const [taskRes, commentRes] = await Promise.all([
                fetch(`http://localhost:8000/tasks/${taskId}`, { headers }),
                fetch(`http://localhost:8000/tasks/${taskId}/comments`, { headers })
            ]);

            if (!taskRes.ok) throw new Error("Tâche introuvable");
            
            const taskBody = await taskRes.json();
            const commentBody = await commentRes.json();

            setTask(taskBody.data);
            setComments(commentBody.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [taskId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="font-medium">Chargement des détails...</p>
        </div>
    );

    if (error || !task) return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-600 font-semibold">⚠️ {error || "Tâche introuvable"}</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-sm text-red-700 underline">Retourner au tableau</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-medium"
                >
                    <span className="mr-2">←</span> Retour au tableau
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-800 mb-4">{task.taskName}</h1>
                            
                            <div className="flex flex-wrap gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityStyle(task.priority)}`}>
                                    {(task.priority || "Normal").toUpperCase()}
                                </span>
                                {task.limitDate && (
                                    <span className="flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                        <span className="mr-1.5">📅</span> {task.limitDate}
                                    </span>
                                )}
                                {task.assignedUserPseudo && (
                                    <span className="flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium border border-indigo-100">
                                        <span className="mr-1.5">👤</span> {task.assignedUserPseudo}
                                    </span>
                                )}
                            </div>
                        </header>

                        <section className="mb-10">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Description</h3>
                            <div className="bg-slate-50 rounded-xl p-5 text-slate-700 leading-relaxed border border-slate-100">
                                {task.description || <i className="text-slate-400">Aucune description fournie.</i>}
                            </div>
                        </section>

                        <hr className="border-slate-100 mb-10" />

                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-6">
                                Commentaires <span className="text-indigo-500 ml-1">({comments.length})</span>
                            </h3>

                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                        <p className="text-slate-400 italic">Pas encore de commentaires.</p>
                                    </div>
                                ) : (
                                    comments.map((c) => (
                                        <div key={c.commentId} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                            <div className="flex items-center mb-2">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">
                                                    {c.userId?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <span className="font-semibold text-slate-700 text-sm">@{c.userId}</span>
                                                <span className="ml-auto text-[10px] text-slate-400">{new Date(c.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-slate-600 text-sm ml-11">{c.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};