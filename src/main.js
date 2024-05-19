import { registerPlugins } from '@/plugins';
import i18n from './i18n/i18n';
import './styles/common.scss';

import App from './App.vue';

import { createApp } from 'vue';

const app = createApp(App);

app.use(i18n);

registerPlugins(app);

app.mount('#app');
