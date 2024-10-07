import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";

interface ChatPageProps {
  userName: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ userName }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (roomId && token) {
      const websocketUrl = `ws://localhost:3000/room/${roomId}?token=${token}`;
      ws.current = new WebSocket(websocketUrl);

      ws.current.onopen = () => {
        console.log("WebSocket conectado");
      };

      ws.current.onmessage = (event) => {
        const message = event.data;
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      ws.current.onclose = () => {
        console.log("WebSocket desconectado");
      };

      return () => {
        ws.current?.close();
      };
    }
  }, [roomId, token]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (ws.current?.readyState === WebSocket.OPEN) {
        const messageData = {
          userName,
          message: newMessage,
        };
        ws.current.send(JSON.stringify(messageData));
        setNewMessage("");
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Chat Room {roomId}
      </h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">
            {msg}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escreva a sua mensagem..."
          className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
