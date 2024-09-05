<template>
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
</template>

<script>
export default {
  props: ["availableChats"],
  data() {
    return {};
  },
  methods: {
    openChat(user) {
      this.$emit("openChat", user);
    },
  },
};
</script>

<style lang="scss">
.chats {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  height: calc(100vh - 100px);
  min-width: 250px;
  gap: 5px;
  background: rgba($color: #9d9d9d, $alpha: 0.4);

  .chat {
    height: 35px;
    padding: 5px 10px;
    border-bottom: 2px solid #0088cc;
    border-top: none;
    border-right: none;
    border-left: none;
    font-size: 1rem;
    color: rgb(0, 0, 0);
    background: rgba($color: #d7d7d7, $alpha: 0.4);

    &:hover {
      cursor: pointer;
      color: rgb(0, 0, 0);
      background: #0088cc;
    }
  }
}
</style>
