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
import { Loader2 } from "lucide-react";

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

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const newColumns = Array.from(columns);
    const startCol = newColumns.find((c) => c.id_column === source.droppableId);
    const endCol = newColumns.find(
      (c) => c.id_column === destination.droppableId,
    );

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

  if (loading) return <Loader2 className="animate-spin m-10" />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      <div className="p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <div
                key={column.id_column}
                className="bg-gray-200 p-4 rounded-xl w-80 shrink-0"
              >
                <h2 className="font-bold mb-4 text-gray-700">{column.name}</h2>

                <Droppable droppableId={column.id_column}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-50"
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
                              className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-300 hover:border-blue-400"
                            >
                              {task.name}
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
    </div>
  );
}
