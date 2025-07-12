<template>
  <div class="p-4 bg-gray-800 flex">
    <input
        v-model="message"
        placeholder="Send a message"
        type="text"
        class="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
        @keyup.enter="sendMessage"
    />
    <button
        class="ml-2 px-4 py-2 bg-blue-500 rounded-lg"
        @click="sendMessage"
    >Send</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const message = ref("");
const emit = defineEmits(['send']);

const sendMessage = () => {
  if (!message.value.trim()) return;

  emit("send", message.value);
  message.value = "";
};
</script>

<style scoped>

</style>
