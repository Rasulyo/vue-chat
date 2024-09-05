//losing connection
export function handleBroadcastMessage(
  event,
  availableUsers,
  selectedUser,
  currentChatUser,
  chatComponent
) {
  if (event.data.type === "userSelection") {
    const user = event.data.user;
    return {
      availableUsers:
        availableUsers &&
        availableUsers?.map((item) => {
          if (user.id === item.id) {
            item.selected = true;
          }
          return item;
        }),
      selectedUser:
        selectedUser && selectedUser.id === user.id ? user : selectedUser,
    };
  } else if (event.data.type === "chatUserSelection") {
    const user = event.data.user;
    return {
      currentChatUser:
        currentChatUser && currentChatUser.id === user.id
          ? user
          : currentChatUser,
    };
  } else if (event.data.type === "userDeselection") {
    const user = event.data.user;
    return {
      availableUsers:
        availableUsers &&
        availableUsers.map((item) => {
          if (user.id === item.id) {
            item.selected = false;
          }
          return item;
        }),
    };
  } else if (event.data.type === "newMessage" && chatComponent) {
    chatComponent.handleBroadcastMessage(event);
  }
  return { availableUsers, selectedUser, currentChatUser };
}
