<template>
  <div id="app">
    <UserSelectionModal
      v-if="!isUserSelected"
      :availableUsers="availableUsers"
      @userSelected="selectUser"
    />
    <div v-else class="wrapper">
      <UserComponent :selectedUser="selectedUser" @logout="logout" />
      <div class="chat__wrapper">
        <ChatsComponent :availableChats="availableChats" @openChat="openChat" />
        <ChatComponent
          v-if="currentChatUser"
          :currentUser="selectedUser"
          :chatUser="currentChatUser"
          ref="chatComponent"
        />
        <div v-else>Выберите чат</div>
      </div>
    </div>
  </div>
</template>

<script>
import UserSelectionModal from "../components/UserSelectionModal.vue";
import ChatComponent from "../components/ChatComponent.vue";
import UserComponent from "../components/UserComponent.vue";
import ChatsComponent from "../components/ChatsComponent.vue";

const channelName = "chat_channel";
const bc = new BroadcastChannel(channelName);

export default {
  components: {
    UserSelectionModal,
    ChatComponent,
    ChatsComponent,
    UserComponent,
  },

  data() {
    return {
      availableUsers: [
        {
          id: 1,
          name: "Nicki Angela",
          selected: false,
          img: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=1480&t=st=1725445424~exp=1725446024~hmac=1f005acd5003f70621766cc305edf14552e8ab9bb8964374ff4ede5a5d2e53d5",
        },
        {
          id: 2,
          name: "Raul",
          selected: false,
          img: "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses-half-shaved-head_23-2149436187.jpg",
        },
        {
          id: 3,
          name: "Jess",
          selected: false,
          img: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?t=st=1725368055~exp=1725368655~hmac=fb66d6d571e820cdad66a1e35327a7e989c80d35384be0e1bf1f452a074c030c",
        },
      ],
      selectedUser: null,
      currentChatUser: null,
      isMounted: false,
    };
  },
  computed: {
    isUserSelected() {
      return this.selectedUser !== null;
    },
    availableChats() {
      return this.availableUsers.filter(
        (item) => item.id !== this.selectedUser.id
      );
    },
  },
  mounted() {
    if (this.availableUsers && this.availableUsers.length > 0) {
      this.syncSelectedUsers();
    }
    window.addEventListener("storage", this.syncSelectedUsers);
    bc.onmessage = this.handleBroadcastMessage;
    this.isMounted = true;
  },

  watch: {
    selectedUser(newValue) {
      if (newValue) {
        bc.postMessage({ type: "userSelection", user: newValue });
      }
    },
    currentChatUser(newValue) {
      if (newValue) {
        bc.postMessage({ type: "chatUserSelection", user: newValue });
      }
    },
  },
  methods: {
    selectUser(user) {
      localStorage.setItem(`selectedUser${user.id}`, JSON.stringify(user));
      this.availableUsers =
        this.availableUsers &&
        this.availableUsers.map((item) => {
          if (user.id === item.id) {
            item.selected = true;
          }
          return item;
        });
      this.selectedUser = user;
    },
    syncSelectedUsers() {
      this.availableUsers &&
        this.availableUsers.forEach((user) => {
          const storedUser = localStorage.getItem(`selectedUser${user.id}`);
          if (storedUser) {
            user.selected = false;
          } else {
            user.selected = false;
          }
        });
    },
    logout(id) {
      localStorage.removeItem(`selectedUser${id}`);
      this.selectedUser = null;
      this.currentChatUser = null;
      this.syncSelectedUsers();
    },
    openChat(user) {
      this.currentChatUser = user;
    },
    handleBroadcastMessage(event) {
      if (event.data.type === "userSelection") {
        const user = event.data.user;
        this.availableUsers = this.availableUsers.map((item) => {
          if (user.id === item.id) {
            item.selected = true;
          }
          return item;
        });
        if (this.selectedUser && this.selectedUser.id === user.id) {
          this.selectedUser = user;
        }
      } else if (event.data.type === "chatUserSelection") {
        const user = event.data.user;
        if (this.currentChatUser && this.currentChatUser.id === user.id) {
          this.currentChatUser = user;
        }
      } else if (event.data.type === "userDeselection") {
        const user = event.data.user;
        this.availableUsers = this.availableUsers.map((item) => {
          if (user.id === item.id) {
            item.selected = false;
          }
          return item;
        });
      } else if (event.data.type === "newMessage") {
        if (this.$refs.chatComponent) {
          this.$refs.chatComponent.handleBroadcastMessage(event);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;
  height: 100vh;
  overflow: hidden;

  .chat__wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    margin-top: 5px;
    border-top: 1px solid rgba($color: #d7d7d7, $alpha: 0.4);
    gap: 15px;
    @media screen and (max-width: 767px) {
      gap: 5px;
    }
  }
}
</style>
