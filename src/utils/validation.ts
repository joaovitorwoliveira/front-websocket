export const isValidName = (name: string) => name.trim().length > 0;

export const isValidRoomName = (roomName: string) => roomName.trim().length > 0;

export const saveUserNameToLocalStorage = (name: string) => {
  localStorage.setItem("userName", name.trim());
};
