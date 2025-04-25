import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './services/i18n';
import toast from './services/toast';
import ganttastic from '@infectoone/vue-ganttastic';
import { initSocket } from './services/socket';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'leaflet/dist/leaflet.css';
import './index.css';

if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(toast);
app.use(ganttastic);

initSocket();

app.mount('#app');
