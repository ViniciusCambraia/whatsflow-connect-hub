
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MoreHorizontal, Clock, CheckSquare, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type Priority = "low" | "medium" | "high";
type Status = "todo" | "inProgress" | "review" | "done";

interface KanbanTask {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee?: {
    name: string;
    avatar?: string;
    initials: string;
  };
  dueDate?: string;
  comments: number;
  subtasks: {
    total: number;
    completed: number;
  };
}

const initialTasks: KanbanTask[] = [
  {
    id: 1,
    title: "Configurar novo fluxo de chatbot",
    description: "Criar um fluxo de atendimento para o departamento de vendas",
    status: "todo",
    priority: "high",
    assignee: {
      name: "Ana Silva",
      initials: "AS",
    },
    dueDate: "2023-06-15",
    comments: 3,
    subtasks: {
      total: 5,
      completed: 0,
    },
  },
  {
    id: 2,
    title: "Integrar novo canal de WhatsApp",
    description: "Adicionar número da equipe de suporte no sistema",
    status: "todo",
    priority: "medium",
    assignee: {
      name: "Carlos Oliveira",
      initials: "CO",
    },
    dueDate: "2023-06-18",
    comments: 2,
    subtasks: {
      total: 3,
      completed: 1,
    },
  },
  {
    id: 3,
    title: "Otimizar tempo de resposta",
    description: "Analisar e melhorar o tempo médio de resposta dos atendentes",
    status: "inProgress",
    priority: "medium",
    assignee: {
      name: "Juliana Costa",
      initials: "JC",
    },
    dueDate: "2023-06-20",
    comments: 5,
    subtasks: {
      total: 4,
      completed: 2,
    },
  },
  {
    id: 4,
    title: "Criar relatório de atendimentos",
    description: "Desenvolver dashboard de estatísticas de atendimento",
    status: "inProgress",
    priority: "high",
    assignee: {
      name: "Rafael Santos",
      initials: "RS",
    },
    dueDate: "2023-06-22",
    comments: 1,
    subtasks: {
      total: 3,
      completed: 1,
    },
  },
  {
    id: 5,
    title: "Treinar novo atendente",
    description: "Realizar treinamento com novos funcionários",
    status: "review",
    priority: "low",
    assignee: {
      name: "Ana Silva",
      initials: "AS",
    },
    dueDate: "2023-06-25",
    comments: 0,
    subtasks: {
      total: 6,
      completed: 5,
    },
  },
  {
    id: 6,
    title: "Atualizar scripts de atendimento",
    description: "Revisar e atualizar respostas automáticas",
    status: "done",
    priority: "medium",
    assignee: {
      name: "Carlos Oliveira",
      initials: "CO",
    },
    dueDate: "2023-06-10",
    comments: 4,
    subtasks: {
      total: 2,
      completed: 2,
    },
  },
];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [newTask, setNewTask] = useState<Partial<KanbanTask>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    subtasks: { total: 0, completed: 0 },
    comments: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    );
    
    setTasks(updatedTasks);
    
    toast({
      title: "Tarefa movida",
      description: `Tarefa atualizada para ${getStatusTranslation(status)}`,
    });
  };

  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Erro",
        description: "O título da tarefa é obrigatório",
        variant: "destructive",
      });
      return;
    }
    
    const task: KanbanTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      title: newTask.title,
      description: newTask.description || "",
      status: newTask.status as Status || "todo",
      priority: newTask.priority as Priority || "medium",
      comments: 0,
      subtasks: { total: 0, completed: 0 },
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      subtasks: { total: 0, completed: 0 },
      comments: 0,
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Tarefa adicionada",
      description: "Nova tarefa adicionada com sucesso",
    });
  };

  const getStatusTranslation = (status: Status) => {
    switch (status) {
      case "todo":
        return "A fazer";
      case "inProgress":
        return "Em progresso";
      case "review":
        return "Em revisão";
      case "done":
        return "Concluído";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityText = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "Baixa";
      case "medium":
        return "Média";
      case "high":
        return "Alta";
      default:
        return priority;
    }
  };

  const filterTasksByStatus = (status: Status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kanban</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Título da tarefa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Descrição da tarefa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        status: e.target.value as Status,
                      })
                    }
                  >
                    <option value="todo">A fazer</option>
                    <option value="inProgress">Em progresso</option>
                    <option value="review">Em revisão</option>
                    <option value="done">Concluído</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <select
                    id="priority"
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as Priority,
                      })
                    }
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTask}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* A fazer */}
        <div
          className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "todo")}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              A fazer ({filterTasksByStatus("todo").length})
            </h2>
          </div>
          <div className="p-4 space-y-4 h-[calc(100vh-16rem)] overflow-y-auto">
            {filterTasksByStatus("todo").map((task) => (
              <Card
                key={task.id}
                className="cursor-move shadow-sm hover:shadow transition-shadow duration-200"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <Badge
                      className={`${getPriorityColor(task.priority)} text-white text-xs`}
                    >
                      {getPriorityText(task.priority)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                        <DropdownMenuItem>Atribuir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-sm font-medium mt-2">
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      {task.dueDate && (
                        <div className="flex items-center mr-3">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {task.assignee && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <CheckSquare className="h-3 w-3 mr-1" />
                        <span>
                          {task.subtasks.completed}/{task.subtasks.total}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>{task.comments}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Em progresso */}
        <div
          className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "inProgress")}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Em progresso ({filterTasksByStatus("inProgress").length})
            </h2>
          </div>
          <div className="p-4 space-y-4 h-[calc(100vh-16rem)] overflow-y-auto">
            {filterTasksByStatus("inProgress").map((task) => (
              <Card
                key={task.id}
                className="cursor-move shadow-sm hover:shadow transition-shadow duration-200"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <Badge
                      className={`${getPriorityColor(task.priority)} text-white text-xs`}
                    >
                      {getPriorityText(task.priority)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                        <DropdownMenuItem>Atribuir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-sm font-medium mt-2">
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      {task.dueDate && (
                        <div className="flex items-center mr-3">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {task.assignee && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <CheckSquare className="h-3 w-3 mr-1" />
                        <span>
                          {task.subtasks.completed}/{task.subtasks.total}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>{task.comments}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Em revisão */}
        <div
          className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "review")}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Em revisão ({filterTasksByStatus("review").length})
            </h2>
          </div>
          <div className="p-4 space-y-4 h-[calc(100vh-16rem)] overflow-y-auto">
            {filterTasksByStatus("review").map((task) => (
              <Card
                key={task.id}
                className="cursor-move shadow-sm hover:shadow transition-shadow duration-200"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <Badge
                      className={`${getPriorityColor(task.priority)} text-white text-xs`}
                    >
                      {getPriorityText(task.priority)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                        <DropdownMenuItem>Atribuir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-sm font-medium mt-2">
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      {task.dueDate && (
                        <div className="flex items-center mr-3">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {task.assignee && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <CheckSquare className="h-3 w-3 mr-1" />
                        <span>
                          {task.subtasks.completed}/{task.subtasks.total}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>{task.comments}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Concluído */}
        <div
          className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "done")}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Concluído ({filterTasksByStatus("done").length})
            </h2>
          </div>
          <div className="p-4 space-y-4 h-[calc(100vh-16rem)] overflow-y-auto">
            {filterTasksByStatus("done").map((task) => (
              <Card
                key={task.id}
                className="cursor-move shadow-sm hover:shadow transition-shadow duration-200"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <Badge
                      className={`${getPriorityColor(task.priority)} text-white text-xs`}
                    >
                      {getPriorityText(task.priority)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                        <DropdownMenuItem>Atribuir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-sm font-medium mt-2">
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      {task.dueDate && (
                        <div className="flex items-center mr-3">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {task.assignee && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <CheckSquare className="h-3 w-3 mr-1" />
                        <span>
                          {task.subtasks.completed}/{task.subtasks.total}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>{task.comments}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default KanbanBoard;
