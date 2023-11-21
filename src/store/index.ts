import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useComStore from './modules/comStore'
import { initPlugin } from './plugins/sdkClientEvents'


const pinia = createPinia();


const plugin = initPlugin()
pinia.use(plugin)

export { useAppStore, useUserStore, useComStore };
export default pinia;
