import axios from "axios";

export async function createRoom(name: string, roomName: string) {
  return axios.post("http://localhost:3000/api/rooms", {
    userName: name.trim(),
    roomName: roomName.trim(),
  });
}
