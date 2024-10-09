import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../http/create-room";
import {
  isValidName,
  isValidRoomName,
  saveUserNameToLocalStorage,
} from "../utils/validation";
import { extractRoomIdAndToken, navigateToChat } from "../utils/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface WelcomePageProps {
  setUserName: (name: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ setUserName }) => {
  const [name, setName] = useState<string>(
    () => localStorage.getItem("userName") || ""
  );
  const [roomName, setRoomName] = useState<string>("");
  const [savedName, setSavedName] = useState<string>(name);
  const [joinLink, setJoinLink] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (savedName) setUserName(savedName);
  }, [savedName, setUserName]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidName(name)) {
      saveUserNameToLocalStorage(name);
      setSavedName(name.trim());
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidRoomName(roomName)) {
      try {
        const response = await createRoom(savedName, roomName);
        const { roomId, token } = response.data;

        localStorage.setItem(`roomName_${roomId}`, roomName);
        navigateToChat(roomId, token, navigate);
      } catch (error) {
        console.error("Erro ao criar sala:", error);
      }
    }
  };

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { roomId, token } = extractRoomIdAndToken(joinLink);
      if (roomId && token) {
        navigateToChat(roomId, token, navigate);
      } else {
        console.error("Room ID ou Token inválidos.");
      }
    } catch (error) {
      console.error("Erro ao entrar na sala:", error);
    }
  };

  return (
    <Card className="w-full m-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Bem-vindo ao Chat WebSocket</CardTitle>
        <CardDescription>
          {savedName
            ? `Olá, ${savedName}! Crie uma sala ou entre em alguma através do convite recebido.`
            : "Insira o seu nome para começar"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveName} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="name">Seu nome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o seu nome"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>

        {savedName && (
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Criar Sala</TabsTrigger>
              <TabsTrigger value="join">Entrar na Sala</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Nome da Sala</Label>
                  <Input
                    id="roomName"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Nome da Sala"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Criar sala
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="join">
              <form onSubmit={handleJoinChat} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="joinLink">Link do Convite</Label>
                  <Input
                    id="joinLink"
                    type="text"
                    value={joinLink}
                    onChange={(e) => setJoinLink(e.target.value)}
                    placeholder="Insira aqui o link do convite"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Entrar no chat
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default WelcomePage;
