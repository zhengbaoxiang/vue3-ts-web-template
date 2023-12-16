/*
 * @Date: 2023-07-17 13:14:59
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-15 14:32:52
 * @descript: 文件描述
 */

import { RouteRecordRaw } from 'vue-router';
import PageLayout from '@/layout/page-layout.vue';
import appRoutes from './modules';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        redirect: 'chat-page',
        component: PageLayout,
        children: appRoutes,
    },
    {
        path: '/login',
        name: 'login',
        // component: () => import('@/views/login/accountLogin.vue'),
        component: () => import('@/views/login/oaLogin.vue'),
        meta: {
            locale: '登录',
            requiresAuth: false,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: () => import('@/views/not-found/index.vue'),
        meta: {
            locale: '404 notFound',
            requiresAuth: false,
        }
    },
]


export default routes