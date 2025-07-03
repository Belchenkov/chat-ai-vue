import { createApp } from 'vue';
import { createPinia } from "pinia";
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

import './style.css'
import App from './App.vue'
import { router } from "./router";

// Init pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

// Init App
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app')
