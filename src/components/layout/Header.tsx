
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications] = useState([
    {
      id: 1,
      title: "Nova mensagem",
      description: "Você recebeu uma nova mensagem",
      time: "5 min atrás",
    },
    {
      id: 2,
      title: "Lembrete de tarefa",
      description: "A tarefa 'Responder emails' está atrasada",
      time: "1 hora atrás",
    },
  ]);
  const [userData, setUserData] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserData({
          email: user.email,
          name: user.user_metadata.full_name || user.email?.split('@')[0],
        });
      }
    };
    
    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível realizar o logout",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 dark:bg-dark-background dark:border-gray-700">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          {window.location.pathname === "/dashboard" && "Dashboard"}
          {window.location.pathname === "/conversations" && "Conversas"}
          {window.location.pathname === "/contacts" && "Contatos"}
          {window.location.pathname === "/tasks" && "Tarefas"}
          {window.location.pathname === "/kanban" && "Kanban"}
          {window.location.pathname === "/settings" && "Configurações"}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start py-2 cursor-pointer"
                >
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-gray-500">
                    {notification.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {notification.time}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-4 text-center text-gray-500">
                Não há notificações
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt={userData?.name || "User"} />
                <AvatarFallback>
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuItem disabled className="opacity-70">
              {userData?.email || "Carregando..."}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
