import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Copy } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { initializeWebSocket, closeWebSocket } from "../utils/websocketUtils";
import { copyInviteLink } from "@/utils/copy-url";

interface ChatPageProps {
  userName: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ userName }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  const token = new URLSearchParams(location.search).get("token");

  const roomName = localStorage.getItem(`roomName_${roomId}`);

  const handleIncomingMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = () => {
    if (ws.current?.readyState === WebSocket.OPEN && newMessage.trim()) {
      const messageData = { userName, message: newMessage };
      ws.current.send(JSON.stringify(messageData));
      setNewMessage("");
    }
  };

  const handleGoBack = () => {
    closeWebSocket(ws.current);
    navigate("/");
  };

  useEffect(() => {
    ws.current = initializeWebSocket(
      roomId,
      token,
      userName,
      handleIncomingMessage
    );

    return () => {
      closeWebSocket(ws.current);
    };
  }, [roomId, token, userName]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopyInviteLink = (
    roomId: string | undefined,
    token: string | null
  ) => {
    if (roomId && token) {
      copyInviteLink(roomId, token);
    } else {
      alert("Não foi possível copiar o link. Room ID ou token ausente.");
    }
  };

  return (
    <Card className="w-full m-auto max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{roomName || `Chat Room ID: ${roomId}`}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleCopyInviteLink(roomId, token)}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copiar convite</span>{" "}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] w-full pr-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="mb-4 p-2 rounded-lg bg-primary/10 animate-in fade-in-50 duration-300"
            >
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escreva a sua mensagem..."
            className="flex-grow"
          />
          <Button type="submit">
            <Send className="h-4 w-4 mr-2" />
            Enviar
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatPage;
