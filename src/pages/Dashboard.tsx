
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/dashboard/StatCard";
import ActivityList from "@/components/dashboard/ActivityList";
import { MessageSquare, Users, CheckSquare, Calendar } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { month: "Jan", ativos: 120, inativos: 45 },
  { month: "Fev", ativos: 135, inativos: 48 },
  { month: "Mar", ativos: 148, inativos: 52 },
  { month: "Abr", ativos: 142, inativos: 54 },
  { month: "Mai", ativos: 165, inativos: 58 },
  { month: "Jun", ativos: 180, inativos: 62 },
  { month: "Jul", ativos: 210, inativos: 65 },
  { month: "Ago", ativos: 245, inativos: 67 },
  { month: "Set", ativos: 240, inativos: 70 },
  { month: "Out", ativos: 270, inativos: 72 },
  { month: "Nov", ativos: 282, inativos: 76 },
  { month: "Dez", ativos: 310, inativos: 80 },
];

const recentActivities = [
  {
    id: 1,
    user: {
      name: "Carlos Silva",
      initials: "CS",
    },
    action: "Respondeu",
    target: "à mensagem de João Cliente",
    time: "5 minutos atrás",
    status: "completed" as const,
  },
  {
    id: 2,
    user: {
      name: "Ana Souza",
      initials: "AS",
    },
    action: "Criou",
    target: "uma nova tarefa para Equipe de Suporte",
    time: "30 minutos atrás",
    status: "active" as const,
  },
  {
    id: 3,
    user: {
      name: "Roberto Gomes",
      initials: "RG",
    },
    action: "Atualizou",
    target: "o status de 3 tickets",
    time: "1 hora atrás",
    status: "completed" as const,
  },
  {
    id: 4,
    user: {
      name: "Juliana Costa",
      initials: "JC",
    },
    action: "Adicionou",
    target: "um novo número de WhatsApp",
    time: "2 horas atrás",
    status: "completed" as const,
  },
  {
    id: 5,
    user: {
      name: "Marcos Oliveira",
      initials: "MO",
    },
    action: "Configurou",
    target: "um novo fluxo de chatbot",
    time: "3 horas atrás",
    status: "pending" as const,
  },
];

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-6 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Conversas Ativas"
            value="184"
            description="Último mês: 165"
            icon={<MessageSquare className="h-4 w-4 text-blue-600" />}
            trend={{ value: 11.5, positive: true }}
          />
          <StatCard
            title="Total de Contatos"
            value="3,642"
            description="Último mês: 3,245"
            icon={<Users className="h-4 w-4 text-green-600" />}
            trend={{ value: 12.2, positive: true }}
          />
          <StatCard
            title="Tarefas Concluídas"
            value="256"
            description="Último mês: 302"
            icon={<CheckSquare className="h-4 w-4 text-amber-600" />}
            trend={{ value: 15.2, positive: false }}
          />
          <StatCard
            title="Agendamentos"
            value="64"
            description="Último mês: 51"
            icon={<Calendar className="h-4 w-4 text-purple-600" />}
            trend={{ value: 25.5, positive: true }}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Contatos por Mês</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorAtivos"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorInativos"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="ativos"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorAtivos)"
                        name="Contatos Ativos"
                      />
                      <Area
                        type="monotone"
                        dataKey="inativos"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#colorInativos)"
                        name="Contatos Inativos"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <div className="col-span-3">
                <ActivityList activities={recentActivities} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análises detalhadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Visualizações detalhadas de análises e métricas serão exibidas aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Geração e visualização de relatórios detalhados sobre o funcionamento da plataforma.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
