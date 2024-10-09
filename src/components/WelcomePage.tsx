import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../http/create-room";

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

  const isValidName = (name: string) => name.trim().length > 0;

  const saveUserNameToLocalStorage = (name: string) => {
    localStorage.setItem("userName", name.trim());
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidName(name)) {
      saveUserNameToLocalStorage(name);
      setSavedName(name.trim());
    }
  };

  const isValidRoomName = (roomName: string) => roomName.trim().length > 0;

  const createChatRoom = async (name: string, roomName: string) => {
    const response = await createRoom(name, roomName);
    return response.data;
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidRoomName(roomName)) {
      try {
        const { roomId, token } = await createChatRoom(savedName, roomName);
        navigateToChat(roomId, token);
      } catch (error) {
        console.error("Erro ao criar sala:", error);
      }
    }
  };

  const extractRoomIdAndToken = (link: string) => {
    const url = new URL(link);
    const roomId = url.pathname.split("/")[2];
    const token = url.searchParams.get("token");
    return { roomId, token };
  };

  const navigateToChat = (roomId: string, token: string) => {
    navigate(`/chat/${roomId}?token=${token}`);
  };
  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { roomId, token } = extractRoomIdAndToken(joinLink);
      if (roomId && token) {
        navigateToChat(roomId, token);
      } else {
        console.error("Room ID ou Token inválidos.");
      }
    } catch (error) {
      console.error("Erro ao entrar na sala:", error);
    }
  };

  return (
    <div className="bg-slate-200 shadow-md rounded px-8 pt-6 pb-8 mb-4  ">
      <h1 className="text-2xl font-bold mb-10 text-center text-slate-900 lg:text-3xl">
        {savedName
          ? `Bem vindo ao chat Websocket, ${savedName}! Crie uma sala ou entre em alguma através do convite recebido.`
          : "Bem vindo ao chat Websocket! Insira o seu nome"}
      </h1>
      <div className="flex flex-col gap-10">
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
              className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Salvar
            </button>
          </div>
        </form>

        <form onSubmit={handleJoinChat} className="space-y-4 mb-4">
          <div>
            <h1 className="text-xl font-semibold my-2  text-slate-900">
              Tem algum convite? Insira aqui e entre na conversa!
            </h1>
            <input
              type="text"
              value={joinLink}
              onChange={(e) => setJoinLink(e.target.value)}
              placeholder="Insira aqui o link do convite"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Entrar no chat
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
              className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Criar sala
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WelcomePage;
