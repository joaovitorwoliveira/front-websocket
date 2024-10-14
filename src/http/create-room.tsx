import axios from "axios";

export async function createRoom(name: string, roomName: string) {
  console.log("Chamando a API para criar sala com:", name, roomName); // Log aqui
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("REACT_APP_API_URL is not defined.");
  }

  return axios.post(`${apiUrl}/rooms`, {
    userName: name.trim(),
    roomName: roomName.trim(),
  });
}
