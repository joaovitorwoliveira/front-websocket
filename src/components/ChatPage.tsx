import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { initializeWebSocket, closeWebSocket } from "../utils/websocketUtils"; // Importe as funções

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

  return (
    <div className="bg-slate-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-10">
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
      <form onSubmit={handleSendMessage} className="flex mb-4">
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
      <button
        onClick={handleGoBack}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Voltar
      </button>
    </div>
  );
};

export default ChatPage;
