import { useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { User } from "@/App";
import { Navbar } from "@/components/Navbar";
import { Loader2, UserPlus, X, Search, CheckCircle2 } from "lucide-react";

interface Task {
  id_task: string;
  name: string;
  position: number;
  id_column: string;
}

interface Column {
  id_column: string;
  name: string;
  tasks: Task[];
}

export function BoardDetail({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const { boardId } = useParams();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la modale d'invitation
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchPseudo, setSearchPseudo] = useState("");
  const [inviteStatus, setInviteStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [foundUser, setFoundUser] = useState<string | null>(null);

  // Effet pour rechercher l'utilisateur quand on tape le pseudo
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchPseudo.trim().length > 1) {
        try {
          // Utilisation de ta route de recherche Tomcat (via le proxy Deno sur le port 8000)
          const response = await fetch(`http://localhost:8000/users/autocomplete?pseudo=${searchPseudo}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setFoundUser(data.pseudo); // On stocke le pseudo exact trouvé
          } else {
            setFoundUser(null);
          }
        } catch (err) {
          setFoundUser(null);
        }
      } else {
        setFoundUser(null);
      }
    }, 500); // Délai de 500ms pour ne pas harceler l'API

    return () => clearTimeout(timer);
  }, [searchPseudo, user.token]);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/boards/${boardId}/full`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        if (response.ok) {
          const data = await response.json();
          const formattedColumns = data.columns.map((col: Column) => ({
            ...col,
            tasks: col.tasks.sort((a, b) => a.position - b.position),
          }));
          setColumns(formattedColumns);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoardData();
  }, [boardId, user.token]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const pseudoToSend = foundUser || searchPseudo;
    if (!pseudoToSend.trim()) return;

    setIsSending(true);
    setInviteStatus(null);

    try {
      const response = await fetch(`http://localhost:8000/boards/${boardId}/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ pseudo: pseudoToSend }),
      });

      const result = await response.json();

      if (response.ok) {
        setInviteStatus({ type: 'success', msg: `Invitation envoyée à ${pseudoToSend}` });
        setSearchPseudo("");
        setFoundUser(null);
      } else {
        setInviteStatus({ type: 'error', msg: result.message || "Erreur lors de l'envoi" });
      }
    } catch (err) {
      setInviteStatus({ type: 'error', msg: "Erreur réseau" });
    } finally {
      setIsSending(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newColumns = Array.from(columns);
    const startCol = newColumns.find((c) => c.id_column === source.droppableId);
    const endCol = newColumns.find((c) => c.id_column === destination.droppableId);

    if (startCol && endCol) {
      const [movedTask] = startCol.tasks.splice(source.index, 1);
      movedTask.id_column = destination.droppableId;
      endCol.tasks.splice(destination.index, 0, movedTask);
      setColumns(newColumns);

      try {
        await fetch(`http://localhost:8000/tasks/${draggableId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            id_column: destination.droppableId,
            position: destination.index,
          }),
        });
      } catch (err) {
        alert("Erreur lors de la sauvegarde du mouvement");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="size-12 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-500 font-medium">Chargement du tableau...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />
      
      {/* Bouton d'invitation positionné à droite */}
      <div className="flex justify-end w-full">
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mt-8 mr-8 text-white px-5 py-2.5 rounded-xl transition-all font-bold shadow-lg active:scale-95 border-2 border-white"
        >
          <UserPlus className="size-5" />
          Inviter un membre
        </button>
      </div>

      <div className="p-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4 items-start">
            {columns.map((column) => (
              <div
                key={column.id_column}
                className="bg-gray-100 p-4 rounded-xl w-80 shrink-0 border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-700 uppercase text-xs tracking-widest">{column.name}</h2>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full text-blue-500 border border-blue-100 shadow-sm">{column.tasks.length}</span>
                </div>

                <Droppable droppableId={column.id_column}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[150px]"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id_task}
                          draggableId={task.id_task}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group"
                            >
                              <p className="text-gray-700 font-medium text-sm">{task.name}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* MODALE D'INVITATION */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsInviteModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Inviter un collaborateur</h2>
              <button onClick={() => setIsInviteModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="size-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSendInvite}>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input 
                  type="text" 
                  value={searchPseudo}
                  onChange={(e) => setSearchPseudo(e.target.value)}
                  placeholder="Rechercher le pseudo..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  autoFocus
                />
                
                {/* Petit indicateur si l'utilisateur est trouvé */}
                {foundUser && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">
                    <CheckCircle2 className="size-3" />
                    Utilisateur trouvé
                  </div>
                )}
              </div>

              {inviteStatus && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
                  inviteStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {inviteStatus.type === 'success' && <CheckCircle2 className="size-4" />}
                  {inviteStatus.msg}
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <button 
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSending || !searchPseudo.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  {isSending ? <Loader2 className="size-4 animate-spin" /> : "Envoyer l'invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}