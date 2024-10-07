import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../http/create-room";

interface WelcomePageProps {
  setUserName: (name: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ setUserName }) => {
  const [name, setName] = useState(
    () => localStorage.getItem("userName") || ""
  );
  const [roomName, setRoomName] = useState("");
  const [savedName, setSavedName] = useState(name);
  const navigate = useNavigate();

  useEffect(() => {
    if (savedName) {
      setUserName(savedName);
    }
  }, [savedName, setUserName]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("userName", name.trim());
      setSavedName(name.trim());
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      try {
        const response = await createRoom(savedName, roomName);
        const { roomId, token } = response.data;
        navigate(`/chat/${roomId}?token=${token}`);
      } catch (error) {
        console.error("Erro ao criar sala:", error);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {savedName
          ? `Bem vindo ao chat Websocket, ${savedName}! Crie uma sala ou entre em alguma através da URL recebida.`
          : "Bem vindo ao chat Websocket! Insira o seu nome"}
      </h1>

      <form onSubmit={handleSaveName} className="space-y-4 mb-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o seu nome"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Salvar
          </button>
        </div>
      </form>

      <form onSubmit={handleCreateRoom} className="space-y-4">
        <div>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Nome da Sala"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Criar sala
          </button>
        </div>
      </form>
    </div>
  );
};

export default WelcomePage;
