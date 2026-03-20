import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { User } from "@/App";
import { Navbar } from "@/components/Navbar";
import { Loader2, UserPlus, X, Search, CheckCircle2, Pencil, Trash2, Check, RotateCcw, Plus } from "lucide-react";

// Importation des interfaces depuis ton fichier centralisé
import { 
  BoardDetailDto, 
  BoardColumnDto, 
  UserDto 
} from "@/types/interfaces-dtos";

export function BoardDetail({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState<BoardColumnDto[]>([]);
  const [boardName, setBoardName] = useState("");
  const [ownerPseudo, setOwnerPseudo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // États pour la modification du nom
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  // États pour la modale d'invitation
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchPseudo, setSearchPseudo] = useState("");
  const [suggestions, setSuggestions] = useState<UserDto[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [foundUser, setFoundUser] = useState<string | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [addingTaskToColumn, setAddingTaskToColumn] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");
  const [newTaskLimitDate, setNewTaskLimitDate] = useState("");

  // --- AUTOCOMPLETION ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchPseudo.trim().length > 1) {
        try {
          const response = await fetch(`http://localhost:8000/users/autocomplete?pseudo=${searchPseudo}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });

          if (response.ok) {
            const result = await response.json();
            const allUsers: UserDto[] = result.data || [];
            const filteredUsers = allUsers.filter(
              (u: UserDto) => u.pseudo.toLowerCase() !== user.pseudo.toLowerCase()
            );
            setSuggestions(filteredUsers);
            setShowSuggestions(filteredUsers.length > 0);
            
            const exactMatch = filteredUsers.find(
              (u: UserDto) => u.pseudo.toLowerCase() === searchPseudo.toLowerCase()
            );
            setFoundUser(exactMatch ? exactMatch.pseudo : null);
          }
        } catch (err) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setFoundUser(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchPseudo, user.token, user.pseudo]);

  // --- CHARGEMENT DES DONNÉES DU TABLEAU ---
  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/boards/${boardId}`,
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
        if (response.ok) {
          const result = await response.json();
          const data: BoardDetailDto = result.data; // Deno encapsule dans .data
          
          if (!data) return;

          setOwnerPseudo(data.ownerPseudo);
          setBoardName(data.boardName || "Tableau sans nom");
          setTempName(data.boardName || "Tableau sans nom");

          if (data.columns) {
            const formattedColumns = [...data.columns]
              .sort((a, b) => a.position - b.position)
              .map((col) => ({
                ...col,
                tasks: col.tasks ? [...col.tasks].sort((a, b) => a.position - b.position) : [],
              }));
            setColumns(formattedColumns);
          }
        }
      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoardData();
  }, [boardId, user.token]);

  // --- SUPPRESSION DU TABLEAU ---
  const handleDeleteBoard = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce tableau ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/boards/${boardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.ok) {
        // REDIRECTION VERS LE DASHBOARD APRÈS SUPPRESSION
        navigate("/dashboard"); 
      } else {
        alert("Erreur lors de la suppression du tableau.");
      }
    } catch (err) {
      alert("Erreur réseau lors de la suppression.");
    }
  };

  // --- MODIFICATION DU NOM ---
  const handleUpdateName = async () => {
    if (!tempName.trim() || tempName === boardName) {
      setIsEditingName(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/boards/${boardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ boardName: tempName }),
      });

      if (response.ok) {
        setBoardName(tempName);
        setIsEditingName(false);
      } else {
        alert("Erreur lors de la modification du nom.");
      }
    } catch (err) {
      alert("Erreur réseau.");
    }
  };
  const
    getPriorityStyles = (p: string | null) => {
  const priority = p?.toUpperCase() || "LOW"; 
  
  switch (priority) {
    case "HIGH": return "bg-red-100 text-red-700 border-red-200";
    case "MEDIUM": return "bg-amber-100 text-amber-700 border-amber-200";
    case "LOW": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default: return "bg-gray-100 text-gray-700";
  }
};
  
  const handleDeleteTask = async (taskId: string) => {
  if (!window.confirm("Supprimer cette tâche ?")) return;

  try {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${user.token}`,
        "X-User-Pseudo": user.pseudo
      },
    });

    if (response.ok) {
      setColumns(prev => prev.map(col => ({
        ...col,
        tasks: col.tasks.filter(t => t.idTask !== taskId)
      })));
    }
  } catch (err) {
    console.error("Erreur suppression:", err);
  }
};

  // --- ENVOI DE L'INVITATION ---
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const pseudoToSend = foundUser || searchPseudo;

    if (pseudoToSend.toLowerCase() === user.pseudo.toLowerCase()) {
        setInviteStatus({ type: 'error', msg: "Opération impossible : vous êtes déjà propriétaire." });
        return;
    }

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

const handleAddColumn = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newColumnName.trim()) return;

  try {
    const response = await fetch(`http://localhost:8000/boards/${boardId}/columns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ columnName: newColumnName.trim() }),
    });

    if (response.ok) {
      const result = await response.json();
      setColumns([...columns, { ...result.data, tasks: [] }]);
      setNewColumnName("");
      setIsAddingColumn(false);
    }
  } catch (err) {
    console.error("Erreur création colonne:", err);
  }
  };
  
  
  // --- MODIFIER LE NOM D'UNE COLONNE ---
const handleUpdateColumnName = async (columnId: string, currentName: string) => {
  const newName = prompt("Nouveau nom de la colonne :", currentName);
  if (!newName || newName.trim() === currentName) return;

  try {
    const response = await fetch(`http://localhost:8000/columns/${columnId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ columnName: newName.trim() }),
    });

    if (response.ok) {
      setColumns(columns.map(col => 
        col.idColumn === columnId ? { ...col, columnName: newName.trim() } : col
      ));
    }
  } catch (err) {
    alert("Erreur lors de la modification");
  }
};

// --- SUPPRIMER UNE COLONNE ---
const handleDeleteColumn = async (columnId: string) => {
  if (!window.confirm("Supprimer cette colonne et toutes ses tâches ?")) return;

  try {
    const response = await fetch(`http://localhost:8000/columns/${columnId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (response.ok) {
      setColumns(columns.filter(col => col.idColumn !== columnId));
    }
  } catch (err) {
    alert("Erreur lors de la suppression");
  }
  };
  
  const handleAddTask = async (columnId: string) => {
    if (!newTaskName.trim()) return;
    
    const taskData = {
    taskName: newTaskName.trim(),
    description: newTaskDescription.trim(),
    priority: newTaskPriority,
    limitDate: newTaskLimitDate === "" ? null : newTaskLimitDate, 
    assignedUserPseudo: null
  };

  try {
    const response = await fetch(`http://localhost:8000/columns/${columnId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(taskData),
    });

    const result = await response.json();

    if (result.success) {
      setColumns(prev => prev.map(col => {
        if (col.idColumn === columnId) {
          return { ...col, tasks: [...col.tasks, result.data] };
        }
        return col;
      }));
      setNewTaskName("");
      setNewTaskDescription("");
      setNewTaskPriority("LOW");
      setNewTaskLimitDate("");
      setAddingTaskToColumn(null);
    }
  } catch (err) {
    alert("Erreur lors de la création de la tâche");
  }
};

  // --- DRAG AND DROP ---
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newColumns = Array.from(columns);
    const startCol = newColumns.find((c) => c.idColumn === source.droppableId);
    const endCol = newColumns.find((c) => c.idColumn === destination.droppableId);

    if (startCol && endCol) {
      const [movedTask] = startCol.tasks.splice(source.index, 1);
      endCol.tasks.splice(destination.index, 0, movedTask);
      setColumns(newColumns);

      try {
        await fetch(`http://localhost:8000/tasks/${draggableId}/position`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            position: destination.index,
            idColumn: destination.droppableId
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

  const isOwner = user.pseudo === ownerPseudo;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />

      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 mt-8 gap-4">
        <div className="flex items-center gap-4 group">
          {isEditingName ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-3xl font-bold bg-white border-2 border-blue-500 rounded-lg px-3 py-1 outline-none shadow-sm"
                autoFocus
              />
              <button onClick={handleUpdateName} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Check className="size-6" />
              </button>
              <button onClick={() => { setIsEditingName(false); setTempName(boardName); }} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">
                <RotateCcw className="size-6" />
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{boardName}</h1>
              {isOwner && (
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <Pencil className="size-5" />
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <>
              <button
                onClick={handleDeleteBoard}
                className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-xl transition-all font-bold border border-red-200 shadow-sm active:scale-95"
              >
                <Trash2 className="size-5" />
                Supprimer
              </button>
              <button
                onClick={() => {
                  setIsInviteModalOpen(true);
                  setInviteStatus(null);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all font-bold shadow-lg active:scale-95 border-2 border-white"
              >
                <UserPlus className="size-5" />
                Inviter
              </button>
            </>
          )}
        </div>
      </div>

{/* BOARD CONTENT */}
      <div className="p-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4 items-start">
            
            {/* 1. Affichage des colonnes existantes via le .map */}
            {columns.map((column) => (
              <div
                key={column.idColumn}
                className="bg-gray-100 p-4 rounded-xl w-80 shrink-0 border border-gray-200 shadow-sm group/col flex flex-col max-h-[80vh]"
              >
                {/* HEADER DE LA COLONNE AVEC ACTIONS */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-700 uppercase text-xs tracking-widest truncate mr-2">
                    {column.columnName}
                  </h2>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleUpdateColumnName(column.idColumn, column.columnName)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Modifier le nom"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteColumn(column.idColumn)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer la colonne"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                    <span className="ml-1 text-[10px] font-bold bg-white px-2 py-0.5 rounded-full text-blue-500 border border-blue-100 shadow-sm">
                      {column.tasks.length}
                    </span>
                  </div>
                </div>

                {/* ZONE DE DROP POUR LES TÂCHES */}
                <Droppable droppableId={column.idColumn}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex-1 overflow-y-auto min-h-[50px] transition-colors pb-4"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.idTask}
                          draggableId={task.idTask}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => navigate(`/board/${boardId}/tasks/${task.idTask}`)}
                              className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all group relative cursor-pointer active:scale-[0.98]"
                            >
                              {/* Header de la tâche */}
                              <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityStyles(task.priority)}`}>
                                {task.priority || "LOW"}
                              </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation(); // CRUCIAL : Empêche l'ouverture de la page de détails
                                    handleDeleteTask(task.idTask);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all rounded-md hover:bg-red-50"
                                  title="Supprimer la tâche"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>

                              {/* Contenu */}
                              <p className="text-gray-800 font-semibold text-sm leading-tight group-hover:text-blue-600 transition-colors">
                                {task.taskName}
                              </p>

                              {/* Footer : Date limite */}
                              {task.limitDate && (
                                <div className="mt-3 pt-2 border-t border-gray-50 flex items-center text-[10px] text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {new Date(task.limitDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* BAS DE LA COLONNE : AJOUT DE TÂCHE */}
                <div className="mt-2">
                  {addingTaskToColumn === column.idColumn ? (
                    <div className="bg-white p-3 rounded-xl border-2 border-blue-400 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
                      <input
                        className="w-full text-sm font-bold p-1 outline-none border-b border-gray-100 mb-2"
                        placeholder="Titre de la tâche..."
                        autoFocus
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                      />
                      <textarea
                        className="w-full text-xs p-1 outline-none resize-none bg-gray-50 rounded"
                        placeholder="Description (optionnel)..."
                        rows={2}
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                      />
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {/* Sélecteur de Priorité */}
                        <select 
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value as any)}
                          className="text-[10px] font-bold border rounded px-1 py-1 bg-white outline-none"
                        >
                          <option value="LOW">Bas</option>
                          <option value="MEDIUM">Moyen</option>
                          <option value="HIGH">Urgent</option>
                        </select>

                        {/* Input Date */}
                        <input 
                          type="date"
                          value={newTaskLimitDate}
                          onChange={(e) => setNewTaskLimitDate(e.target.value)}
                          className="text-[10px] border rounded px-1 py-1 bg-white outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => handleAddTask(column.idColumn)}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
                        >
                          Créer la tâche
                        </button>
                        <button
                          onClick={() => {
                            setAddingTaskToColumn(null);
                            setNewTaskName("");
                            setNewTaskDescription("");
                          }}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTaskToColumn(column.idColumn)}
                      className="w-full flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all group/btn"
                    >
                      <Plus className="size-4 transition-transform group-hover/btn:rotate-90" />
                      Ajouter une tâche
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* 2. SECTION AJOUT DE COLONNE */}
            <div className="w-80 shrink-0">
              {isAddingColumn ? (
                <div className="bg-gray-100 p-3 rounded-xl border border-blue-200 shadow-sm animate-in fade-in zoom-in duration-200">
                  <form onSubmit={handleAddColumn}>
                    <input
                      type="text"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      placeholder="Nom de la colonne..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 font-medium"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                      >
                        Ajouter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingColumn(false);
                          setNewColumnName("");
                        }}
                        className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="w-full bg-gray-200/50 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 font-bold transition-all hover:text-gray-700 group h-[58px]"
                >
                  <Plus className="size-5 transition-transform group-hover:rotate-90" />
                  Ajouter une colonne
                </button>
              )}
            </div>

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
                  autoComplete="off"
                />

                {showSuggestions && (
                  <div className="absolute z-[110] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    {suggestions.map((u) => (
                      <div
                        key={u.pseudo}
                        onClick={() => {
                          setSearchPseudo(u.pseudo);
                          setFoundUser(u.pseudo);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-none transition-colors"
                      >
                        <span className="font-medium text-gray-700">{u.pseudo}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">{u.role}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {inviteStatus && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium animate-in slide-in-from-top-2 ${
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
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
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