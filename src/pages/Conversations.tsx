
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type ConversationStatus = "active" | "pending" | "resolved";

type Message = {
  id: number;
  content: string;
  sentAt: string;
  sentByUser: boolean;
};

type Conversation = {
  id: number;
  contact: {
    name: string;
    phone: string;
    avatar?: string;
    initials: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: ConversationStatus;
  messages: Message[];
};

const mockConversations: Conversation[] = [
  {
    id: 1,
    contact: {
      name: "João da Silva",
      phone: "+55 11 98765-4321",
      initials: "JS",
    },
    lastMessage: "Olá, preciso de ajuda com meu pedido",
    lastMessageTime: "10:30",
    unreadCount: 3,
    status: "active",
    messages: [
      {
        id: 1,
        content: "Olá, tudo bem?",
        sentAt: "10:25",
        sentByUser: false,
      },
      {
        id: 2,
        content: "Preciso de ajuda com meu pedido #12345",
        sentAt: "10:26",
        sentByUser: false,
      },
      {
        id: 3,
        content: "Ele ainda não chegou e já faz 5 dias",
        sentAt: "10:30",
        sentByUser: false,
      },
    ],
  },
  {
    id: 2,
    contact: {
      name: "Maria Oliveira",
      phone: "+55 11 99876-5432",
      initials: "MO",
    },
    lastMessage: "Obrigada pelo atendimento",
    lastMessageTime: "09:15",
    unreadCount: 0,
    status: "resolved",
    messages: [
      {
        id: 1,
        content: "Bom dia, gostaria de saber sobre a promoção",
        sentAt: "09:00",
        sentByUser: false,
      },
      {
        id: 2,
        content: "Bom dia, Maria! Qual promoção você tem interesse?",
        sentAt: "09:05",
        sentByUser: true,
      },
      {
        id: 3,
        content: "A do produto X que vi no Instagram",
        sentAt: "09:10",
        sentByUser: false,
      },
      {
        id: 4,
        content: "Entendi! Essa promoção é válida até o final do mês e oferece 20% de desconto.",
        sentAt: "09:12",
        sentByUser: true,
      },
      {
        id: 5,
        content: "Obrigada pelo atendimento",
        sentAt: "09:15",
        sentByUser: false,
      },
    ],
  },
  {
    id: 3,
    contact: {
      name: "Carlos Santos",
      phone: "+55 11 97654-3210",
      initials: "CS",
    },
    lastMessage: "Quando meu produto será entregue?",
    lastMessageTime: "Ontem",
    unreadCount: 1,
    status: "pending",
    messages: [
      {
        id: 1,
        content: "Olá, fiz um pedido na semana passada",
        sentAt: "18:30",
        sentByUser: false,
      },
      {
        id: 2,
        content: "Quando meu produto será entregue?",
        sentAt: "18:35",
        sentByUser: false,
      },
    ],
  },
  {
    id: 4,
    contact: {
      name: "Ana Rodrigues",
      phone: "+55 11 98765-1234",
      initials: "AR",
    },
    lastMessage: "Preciso trocar o produto que comprei",
    lastMessageTime: "Ontem",
    unreadCount: 2,
    status: "active",
    messages: [
      {
        id: 1,
        content: "Boa tarde",
        sentAt: "14:30",
        sentByUser: false,
      },
      {
        id: 2,
        content: "Preciso trocar o produto que comprei",
        sentAt: "14:35",
        sentByUser: false,
      },
    ],
  },
  {
    id: 5,
    contact: {
      name: "Pedro Almeida",
      phone: "+55 11 99876-4321",
      initials: "PA",
    },
    lastMessage: "Quais são as formas de pagamento?",
    lastMessageTime: "Seg",
    unreadCount: 0,
    status: "resolved",
    messages: [
      {
        id: 1,
        content: "Olá, gostaria de saber quais são as formas de pagamento aceitas",
        sentAt: "15:20",
        sentByUser: false,
      },
      {
        id: 2,
        content: "Olá Pedro, aceitamos cartão de crédito, boleto e PIX",
        sentAt: "15:25",
        sentByUser: true,
      },
      {
        id: 3,
        content: "Quais são as formas de pagamento?",
        sentAt: "15:30",
        sentByUser: false,
      },
    ],
  },
];

const Conversations = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<string>("active");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = mockConversations.filter(
    (conversation) =>
      (activeTab === "all" ||
        (activeTab === "active" && conversation.status === "active") ||
        (activeTab === "pending" && conversation.status === "pending") ||
        (activeTab === "resolved" && conversation.status === "resolved")) &&
      (searchQuery === "" ||
        conversation.contact.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        conversation.contact.phone
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // In a real application, we would send this to an API
    console.log(`Sending message to ${selectedConversation.contact.name}: ${newMessage}`);
    
    // For demo purposes, we'll just update the local state
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "resolved":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <MainLayout>
      <div className="flex h-full overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar conversas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Tabs
            defaultValue="active"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <TabsList className="w-full">
                <TabsTrigger value="active" className="flex-1">
                  Ativos
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                  Pendentes
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex-1">
                  Resolvidos
                </TabsTrigger>
                <TabsTrigger value="all" className="flex-1">
                  Todos
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="active" className="flex-1 mt-0 p-0">
              <ScrollArea className="h-[calc(100vh-13rem)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.contact.avatar} />
                          <AvatarFallback>{conversation.contact.initials}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${getStatusColor(
                            conversation.status
                          )}`}
                        ></span>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {conversation.contact.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="pending" className="flex-1 mt-0 p-0">
              <ScrollArea className="h-[calc(100vh-13rem)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.contact.avatar} />
                          <AvatarFallback>{conversation.contact.initials}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${getStatusColor(
                            conversation.status
                          )}`}
                        ></span>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {conversation.contact.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="resolved" className="flex-1 mt-0 p-0">
              <ScrollArea className="h-[calc(100vh-13rem)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.contact.avatar} />
                          <AvatarFallback>{conversation.contact.initials}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${getStatusColor(
                            conversation.status
                          )}`}
                        ></span>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {conversation.contact.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="all" className="flex-1 mt-0 p-0">
              <ScrollArea className="h-[calc(100vh-13rem)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.contact.avatar} />
                          <AvatarFallback>{conversation.contact.initials}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${getStatusColor(
                            conversation.status
                          )}`}
                        ></span>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {conversation.contact.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <Avatar>
                  <AvatarImage src={selectedConversation.contact.avatar} />
                  <AvatarFallback>{selectedConversation.contact.initials}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h2 className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedConversation.contact.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedConversation.contact.phone}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge className={`${
                    selectedConversation.status === "active"
                      ? "bg-green-500 hover:bg-green-600"
                      : selectedConversation.status === "pending"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}>
                    {selectedConversation.status === "active"
                      ? "Ativo"
                      : selectedConversation.status === "pending"
                      ? "Pendente"
                      : "Resolvido"}
                  </Badge>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sentByUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          message.sentByUser
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sentByUser
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {message.sentAt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-end space-x-2">
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-h-[80px] max-h-[200px]"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Nenhuma conversa selecionada
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Selecione uma conversa para visualizar as mensagens
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Conversations;
