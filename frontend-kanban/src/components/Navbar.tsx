import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Plus } from "lucide-react";
import { User } from "@/App";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const navButtonStyle =
    "flex items-center gap-2 px-4 py-1.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200";

  return (
    <nav className="w-full flex items-center justify-between p-3 border-b bg-white shadow-sm">
      <div className="flex items-center gap-6">
        <span className="text-xl font-bold tracking-tighter text-blue-600 ml-2">
          Projet<span className="text-gray-400">Kanban</span>
        </span>

        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            <NavigationMenuItem>
              <button
                type="button"
                className={navButtonStyle}
                onClick={() => console.log("Créer tableau")}
              >
                <Plus className="size-4 stroke-[3px]" />
                <span className="text-sm font-semibold">Nouveau Tableau</span>
              </button>
            </NavigationMenuItem>
            {user?.role === "ADMIN" && (
              <NavigationMenuItem>
                <button
                  type="button"
                  className={navButtonStyle}
                  onClick={() => console.log("Accès Admin")}
                >
                  <ShieldCheck className="size-4 stroke-[2px]" />
                  <span className="text-sm font-semibold">Administration</span>
                </button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-4 px-2">
        <div className="flex flex-col items-end sm:flex">
          <span className="text-xs font-bold text-gray-800 leading-none">
            {user?.pseudo || "Invité"}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">
            {user?.role || "Non connecté"}
          </span>
        </div>

        <Avatar className="h-9 w-9 border-2 border-white shadow-md ring-1 ring-gray-100">
          <AvatarImage src="https://github.com/shadcn.png" alt="Profil" />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
            {user?.pseudo?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
