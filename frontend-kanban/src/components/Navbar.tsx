import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-primary">
          Kanban <span className="text-muted-foreground">M1</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" type="button" className="font-medium">
          Mes Tableaux
        </Button>

        <Button
          variant="outline"
          type="button"
          className="border-primary/20 hover:bg-primary/10"
        >
          Administration
        </Button>

        <div className="h-6 w-px bg-border mx-2" />
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-1">
            <span className="text-sm font-semibold leading-none">
              Neil Admin
            </span>
            <span className="text-xs text-muted-foreground">
              Administrateur
            </span>
          </div>

          <Avatar size="default">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="Profil"
              className="grayscale hover:grayscale-0 transition-all"
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              NA
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
