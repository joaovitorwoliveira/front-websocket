import { useNavigate } from "react-router-dom";

export const extractRoomIdAndToken = (link: string) => {
  const url = new URL(link);
  const roomId = url.pathname.split("/")[2];
  const token = url.searchParams.get("token");
  return { roomId, token };
};

export const navigateToChat = (
  roomId: string,
  token: string,
  navigate: ReturnType<typeof useNavigate>
) => {
  navigate(`/room/${roomId}?token=${token}`);
};
