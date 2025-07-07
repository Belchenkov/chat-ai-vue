<template>
  <div class="py-4 px-6 bg-gray-800 shadow-md flex justify-between items-center">
    <img
        :src="robotImage"
        alt="Chat AI"
        class="w-8 h-8"
    />
    <h1 class="text-lg font-semibold">Chat AI</h1>
    <button
        class="text-gray-400 hover:text-white"
        @click="logout"
    >Logout</button>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from "vue-router";

  import robotImage from '../assets/robot.png';
  import { useUserStore } from "../stores/user.ts";

  const userStore = useUserStore();
  const router = useRouter();

  const logout = () => {
    userStore.logout();
    router.push("/");
  };
</script>

<style scoped>

</style>
