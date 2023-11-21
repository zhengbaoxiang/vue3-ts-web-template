import { createApp } from 'vue';

import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';

import store from './store';
import router from './router';
import i18n from './locale';
import App from './App.vue';

import globalComponents from '@/components';
import directive from './directive';

import '@/assets/style/global.less';
import '@/api/interceptor';
import './mock';

console.log('-import.meta>', import.meta.env)

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(store);
app.use(router);
app.use(i18n);
app.use(globalComponents);
app.use(directive);

app.mount('#app');
