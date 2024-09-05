<template>
  <div class="user">
    <div class="img">
      <h2 class="user__title">{{ selectedUser?.name }}</h2>
      <img :src="selectedUser?.img" alt="User avatar" />
    </div>
    <button class="user__btn" @click="logout(selectedUser.id)">Logout</button>
  </div>
</template>

<script>
export default {
  props: ["selectedUser"],
  data() {
    return {};
  },
  methods: {
    logout(id) {
      this.$emit("logout", id);
    },
  },
};
</script>

<style lang="scss">
.user {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  height: 40px;
  background: rgba(75, 75, 75, 0.4);

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
</style>
