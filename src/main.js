import { registerPlugins } from '@/plugins';
import i18n from './i18n/i18n';
import './styles/common.scss';

import App from './App.vue';
import { registerServiceWorker } from './registerServiceWorker';

import { createApp } from 'vue';

const app = createApp(App);

app.use(i18n);

registerPlugins(app);
registerServiceWorker();

app.mount('#app');
