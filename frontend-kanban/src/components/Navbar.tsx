import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShieldCheck,
  Plus,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
} from "lucide-react";
import { User } from "@/App";
import { Link, useNavigate } from "react-router";

interface NavbarProps {
  user: User | null;
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navButtonStyle =
    "flex items-center gap-2 px-4 py-1.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200";

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    // 1. Rediriger vers la racine
    navigate("/", { replace: true });
    // 2. Nettoyer le state et le localStorage via la fonction de App.tsx
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="w-full flex items-center justify-between p-3 border-b bg-white shadow-sm relative z-50">
      <div className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <span className="text-xl font-bold tracking-tighter text-blue-600 ml-2">
            Projet<span className="text-gray-400">Kanban</span>
          </span>
        </Link>

        <div className="flex gap-4">
          <Link to="/dashboard/new" className={navButtonStyle}>
            <Plus className="size-4 stroke-[3px]" />
            <span className="text-sm font-semibold">Nouveau Tableau</span>
          </Link>

          {user?.role === "ADMIN" && (
            <Link to="/admin" className={navButtonStyle}>
              <ShieldCheck className="size-4 stroke-[2px]" />
              <span className="text-sm font-semibold">Administration</span>
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-200"
        >
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-blue-100">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.pseudo}`}
            />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
              {user?.pseudo?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs font-bold text-gray-800 leading-none">
              {user?.pseudo}
            </span>
            <span className="text-[10px] uppercase text-blue-500 font-bold tracking-tight">
              {user?.role}
            </span>
          </div>
          <ChevronDown
            className={`size-4 text-gray-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-150">
              <div className="px-4 py-2 border-b border-gray-50 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Compte
                </p>
              </div>

              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <UserIcon className="size-4" />
                Mon Profil
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Settings className="size-4" />
                Paramètres
              </button>

              <div className="h-px bg-gray-100 my-1"></div>

              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="size-4" />
                Déconnexion
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
