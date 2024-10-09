export const copyInviteLink = (roomId: string, token: string) => {
  const inviteLink = `${window.location.origin}/chat/${roomId}?token=${token}`;
  navigator.clipboard.writeText(inviteLink).then(() => {
    alert("Link copiado para a área de transferência!");
  });
};
