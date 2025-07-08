import { defineStore } from 'pinia';
import { ref } from "vue";
import axios from "axios";

import { useUserStore } from "./user.ts";

interface ChatMessage {
	message: string;
	reply: string;
}

interface FormattedMessage {
	role: 'user' | 'ai';
	content: string;
}

export const useChatStore = defineStore('chat', () => {
	const messages = ref<{ role: string; content: string }[]>([]);
	const isLoading = ref(false);

	const userStore = useUserStore();
});
