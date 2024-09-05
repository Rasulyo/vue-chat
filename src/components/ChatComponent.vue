<template>
  <div class="chat-container">
    <h3 class="user__title">Чат с {{ chatUser?.name }}</h3>
    <div class="messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message"
        :class="{
          'from-user': message.sender === currentUser?.name,
          'to-user': message.sender !== currentUser?.name,
        }"
      >
        <div>
          <img
            v-if="message.sender !== currentUser?.name"
            class="chat__user"
            :src="chatUser && chatUser.img"
            alt="Chat user"
          />
          <img
            v-if="message.sender === currentUser?.name"
            class="chat__user"
            :src="currentUser && currentUser.img"
            alt="Current user"
          />
        </div>
        <p class="text">{{ message.text }}</p>
      </div>
    </div>
    <div class="message-input">
      <input
        v-model="newMessage"
        @keydown.enter="sendMessage"
        placeholder="Введите сообщение..."
      />
      <button @click="sendMessage" class="send-button">
        <img class="btn-logo" src="../assets/Telegram_logo_icon.svg" alt="" />
        <span class="send-title">Отправить</span>
      </button>
    </div>
  </div>
</template>

<script>
const channelName = "chat_channel";

export default {
  props: ["currentUser", "chatUser"],
  data() {
    return {
      newMessage: "",
      messages: [],
      bc: null,
    };
  },
  watch: {
    chatUser: {
      immediate: true,
      handler() {
        this.loadMessages();
      },
    },
  },
  mounted() {
    this.loadMessages();
    this.bc = new BroadcastChannel(channelName);
    this.bc.onmessage = this.handleBroadcastMessage;
  },
  beforeDestroy() {
    if (this.bc) {
      this.bc.close();
    }
  },
  methods: {
    loadMessages() {
      const chatKey = this.getChatKey();
      const storedMessages = JSON.parse(localStorage.getItem(chatKey)) || [];
      this.messages = storedMessages;
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        const newMessage = {
          id: Date.now(),
          sender: this.currentUser?.name,
          text: this.newMessage.trim(),
        };
        this.messages.push(newMessage);
        this.newMessage = "";
        localStorage.setItem(this.getChatKey(), JSON.stringify(this.messages));
        if (this.bc) {
          this.bc.postMessage({
            type: "newMessage",
            chatKey: this.getChatKey(),
            message: newMessage,
          });
        }
      }
    },
    getChatKey() {
      return `chat_${Math.min(
        this.currentUser?.id,
        this.chatUser?.id
      )}_${Math.max(this.currentUser?.id, this.chatUser?.id)}`;
    },
    handleBroadcastMessage(event) {
      if (
        event.data.type === "newMessage" &&
        event.data.chatKey === this.getChatKey()
      ) {
        const newMessage = event.data.message;
        if (!this.messages.find((msg) => msg.id === newMessage.id)) {
          this.messages.push(newMessage);
          localStorage.setItem(
            this.getChatKey(),
            JSON.stringify(this.messages)
          );
        }
      }
    },
  },
};
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  position: relative;
  max-height: 80vh;
  height: 100%;
  background: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.user__title {
  padding: 10px;
  background-color: #006598;
  color: white;
  margin: 0;
  text-align: center;
  font-size: clamp(14px, 16px, 18px);
}

.messages {
  flex: 1;
  padding: 10px 10px 100px;
  overflow-y: auto;
  gap: 10px;
  background-color: #f0f0f0;
}

.message {
  display: flex;
  margin-bottom: 10px;
  max-width: 100%;
  width: max-content;
  min-width: 150px;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 10px;
  gap: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.from-user {
  align-self: flex-end;
  background-color: #0088cc;
  color: white;
  margin: 5px 0 5px auto;
}

.to-user {
  align-self: flex-start;
  background-color: #343434;
  color: white;
}

.sender {
  font-size: clamp(12px, 14px, 16px);
  font-weight: bold;
}

.text {
  margin-top: 5px;
  font-size: clamp(12px, 14px, 16px);
}

.message-input {
  display: flex;
  padding: 10px;
  position: absolute;
  bottom: 0px;
  right: 0;
  left: 0;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border: none;
  font-size: clamp(13px, 15px, 18px);
  border-radius: 20px;
  background-color: #f0f0f0;
  outline: none;
}

.message-input {
  background-color: #0088cc;
  color: white;
  border: none;
  padding: 10px 20px 15px;
  border-radius: 20px 20px 0 0;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-self: center;
  height: 40px;
}
.send-button {
  background-color: #000000;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-logo {
  height: 20px;
  width: auto;
}
.send-title {
  display: block;
}

.chat__user {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
@media screen and (max-width: 767px) {
  .send-title {
    display: none;
  }
}
</style>
