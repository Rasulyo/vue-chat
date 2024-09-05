<template>
  <div class="chats">
    <button
      v-for="user in availableChats"
      :key="user.id"
      class="chat"
      @click="openChat(user)"
    >
      <img class="chat__user" :src="user.img" alt="user" />
      <span class="user__name">
        {{ user.name }}
      </span>
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
  width: clamp(60px, 14vw, 200px);
  min-width: auto;
  gap: 10px;
  padding-top: 10px;
  background: rgba($color: #9d9d9d, $alpha: 0.4);

  .chat {
    height: 35px;
    padding: 5px 10px;
    border: none;
    gap: 10px;
    display: flex;
    align-items: center;
    font-size: clamp(12px, 14px, 16px);
    color: rgb(0, 0, 0);
    background: rgba($color: #d7d7d7, $alpha: 0.4);

    .user__name {
      display: block;
      @media screen and (max-width: 767px) {
        display: none;
      }
    }

    &:hover {
      cursor: pointer;
      color: rgb(0, 0, 0);
      background: #0088cc;
    }
  }
}
</style>
