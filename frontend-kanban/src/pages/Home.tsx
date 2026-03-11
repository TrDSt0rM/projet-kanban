import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-6xl font-extrabold text-primary mb-6">
        Projet Kanban
      </h1>
      <Button
        size="lg"
        onClick={() => navigate("/login")}
        className="px-8 py-6 text-lg"
      >
        Accéder à mon espace
      </Button>
    </div>
  );
}
