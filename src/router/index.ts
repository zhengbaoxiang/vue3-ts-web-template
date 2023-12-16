import {
    createRouter,
    createWebHistory, // createWebHashHistory
    useRoute,
    RouteRecordRaw,
    LocationQueryRaw,
} from 'vue-router';
import routes from './routes';


import globalConfig from '@/config';
import { getToken, setToken, setTitle } from '@/utils/tools';
import { useUserStore } from '@/store';
import  hasPermission  from '@/hooks/permission';

const { title } = globalConfig
const HOME_NAME = 'home'
const LOGIN_PAGE_NAME = 'login'


const router = createRouter({
    history: createWebHistory(globalConfig.base),
    // history: createWebHashHistory(''),
    routes: routes,
    scrollBehavior() {
        return { top: 0 };
    },
});




router.beforeEach(async (to, from, next) => {
    console.log('-beforeEach>', to.name)
    const token = from.query.token || to.query.token || getToken();

    const userStore = useUserStore();
    if (!token && to.name === LOGIN_PAGE_NAME) {
        next();
    } else if (!token && to.name !== LOGIN_PAGE_NAME) {
        next({
            name: 'login',
            query: {
                redirect: to.name,
                ...to.query,
            } as LocationQueryRaw,
        });
    } else if (token && to.name === LOGIN_PAGE_NAME) {
        next({
            name: HOME_NAME // 跳转到homeName页
        })
    } else if (['401', '403', '404'].includes(to.name as string)) {
        next()
    } else {
        try {
            const access = await userStore.getUserInfo();
            hasAuth(to, access, next);
        } catch (error) {
            // 鉴权接口报错，是否回到登录页？
            console.log('-error>', error)
            next({ name: '404' });
        }
    }
});

const hasAuth = async (to: any, access: [], next: any) => {
    if (hasPermission(to,access)) await next();
    else {
        const destination = { name: '403' };
        await next(destination);
    }
}

router.afterEach(to => {
    setTitle(to, router)
    window.scrollTo(0, 0)
})

export default router;


/**
 *  * 完整的导航解析流程
    导航被触发。
    在失活的组件里调用 beforeRouteLeave 守卫。
    调用全局的 beforeEach 守卫。
    在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
    在路由配置里调用 beforeEnter。
    解析异步路由组件。
    在被激活的组件里调用 beforeRouteEnter。
    调用全局的 beforeResolve 守卫 (2.5+)。
    导航被确认。
    调用全局的 afterEach 钩子。
    触发 DOM 更新。
    调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
*/
