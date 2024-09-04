<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Выберите пользователя</h2>
      <ul class="user-list">
        <li v-for="user in availableUsers" :key="user.id" class="user-item">
          <button
            @click="selectUser(user)"
            :disabled="user.selected"
            class="user-select-btn"
          >
            {{ user.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["availableUsers"],
  methods: {
    selectUser(user) {
      this.$emit("userSelected", user);
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.user-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.user-item {
  margin-bottom: 1rem;
}

.user-select-btn {
  background-color: #0088cc;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  transition: background-color 0.3s ease;
}

.user-select-btn:disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}

.user-select-btn:hover:not(:disabled) {
  background-color: #006699;
}
</style>
