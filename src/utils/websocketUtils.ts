export const initializeWebSocket = (
  roomId: string | undefined,
  token: string | null,
  userName: string,
  handleIncomingMessage: (message: string) => void
): WebSocket | null => {
  if (!roomId || !token || !userName) {
    console.error("Faltam parâmetros: roomId, token ou userName");
    return null;
  }

  const wsUrl = import.meta.env.VITE_WS_API_URL;
  const websocketUrl = `${wsUrl}/room/${roomId}?token=${token}&userName=${encodeURIComponent(
    userName
  )}`;
  const ws = new WebSocket(websocketUrl);

  ws.onerror = function (event) {
    console.error("WebSocket error observed:", event);
  };

  ws.onopen = () => {
    console.log(`WebSocket conectado como ${userName}`);
  };

  ws.onmessage = (event) => {
    console.log("Mensagem recebida:", event.data);
    handleIncomingMessage(event.data);
  };

  ws.onclose = (event) => {
    console.log(
      `WebSocket desconectado. Código: ${event.code}, Razão: ${event.reason}`
    );
  };

  return ws;
};

export const closeWebSocket = (ws: WebSocket | null) => {
  if (ws) {
    ws.close();
    console.log("WebSocket foi fechado");
  }
};
