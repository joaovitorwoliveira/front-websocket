import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRoom } from "../http/create-room";

interface WelcomePageProps {
  setUserName: (name: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ setUserName }) => {
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() && roomName.trim()) {
      try {
        const response = await createRoom(name, roomName);

        const { roomId, token } = response.data;

        setUserName(name.trim());
        navigate(`/chat/${roomId}?token=${token}`);
      } catch (error) {
        console.error("Erro ao criar sala:", error);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Bem vindo ao chat Websocket!
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
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
            Entrar no chat
          </button>
        </div>
      </form>
    </div>
  );
};

export default WelcomePage;
