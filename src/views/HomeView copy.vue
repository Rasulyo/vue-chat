<template>
  <div id="app">
    <UserSelectionModal
      v-if="!isUserSelected"
      :availableUsers="availableUsers"
      @userSelected="selectUser"
    />
    <div v-else class="wrapper">
      <div class="user">
        <div class="img">
          <h2 class="user__title">{{ selectedUser?.name }}</h2>
          <img :src="selectedUser?.img" alt="User avatar" />
        </div>
        <button class="user__btn" @click="logout(selectedUser.id)">
          Logout
        </button>
      </div>
      <div class="chat__wrapper">
        <div class="chats">
          <button
            v-for="user in availableChats"
            :key="user.id"
            class="chat"
            @click="openChat(user)"
          >
            {{ user.name }}
          </button>
        </div>
        <ChatComponent
          :currentUser="selectedUser"
          :chatUser="currentChatUser"
          ref="chatComponent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UserSelectionModal from "../components/UserSelectionModal.vue";
import ChatComponent from "../components/ChatComponent.vue";

const channelName = "chat_channel";
const bc = new BroadcastChannel(channelName);

export default {
  components: {
    UserSelectionModal,
    ChatComponent,
  },

  data() {
    return {
      availableUsers: [
        {
          id: 1,
          name: "Nick",
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
    this.syncSelectedUsers();
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
      this.availableUsers = this.availableUsers.map((item) => {
        if (user.id === item.id) {
          item.selected = true;
        }
        return item;
      });
      this.selectedUser = user;
    },
    syncSelectedUsers() {
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

  .user {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
    height: 40px;
    background: rgba($color: #d7d7d7, $alpha: 0.4);

    .img {
      display: flex;
      gap: 10px;
      align-items: center;
      & img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
    }

    &__title {
      color: #000;
      font-size: 1.6rem;
    }
    &__btn {
      border-radius: 3px;
      border: none;
      padding: 5px 15px;
      font-size: 1.2rem;
      text-transform: lowercase;
      color: #ffffff;
      background: #0088cc;

      &:hover {
        cursor: pointer;
        color: #2e2e2e;
      }
    }
  }
  .chat__wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    margin-top: 5px;
    border-top: 1px solid rgba($color: #d7d7d7, $alpha: 0.4);
    gap: 15px;
    .chats {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      height: calc(100vh - 100px);
      min-width: 250px;
      background: rgb(16, 16, 16);

      .chat {
        height: 35px;
        padding: 5px 10px;
        border: none;
        font-size: 1rem;
        color: white;
        background: rgba($color: #d7d7d7, $alpha: 0.4);

        &:hover {
          cursor: pointer;
          color: rgb(0, 0, 0);
          background: #0088cc;
        }
      }
    }
  }
}
</style>
