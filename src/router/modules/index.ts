/*
 * @Date: 2023-11-20 15:27:58
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-20 16:59:57
 * @descript: 文件描述
 */
import Dashboard from './dashboard';
import Visualization from './visualization';
import List from './list';
import Form from './form';
import Profile from './profile';
import Result from './result';
import User from './user';
import Exception from './exception';
export default [
  Exception,
  Dashboard,
  Visualization,
  List,
  Form,
  User,
  Profile,
  Result,
  {
    path: 'chat-page',
    name: 'chatPage',
    component: () => import('@/views/chat-page/index.vue'),
    meta: {
      locale: '聊天页面',
      icon: 'icon-message',
      requiresAuth: true,
      roles: ['Admin', 'Auditor', 'User'],
    },
  },
  {
    path: 'batch-msg',
    name: 'batchMsg',
    component: () => import('@/views/batch-msg/index.vue'),
    meta: {
      locale: '批量发消息',
      icon: 'icon-list',
      requiresAuth: true,
      roles: ['Admin', 'Auditor', 'User'],
    },
  },
  {
    path: 'auth-user',
    name: 'authUser',
    component: () => import('@/views/auth-user/index.vue'),
    meta: {
      locale: '用户权限',
      icon: 'icon-user',
      requiresAuth: true,
      roles: ['Admin'],
    },
  },

  {
    path: 'account',
    name: 'account',
    component: () => import('@/views/account/index.vue'),
    meta: {
      locale: '账户管理',
      icon: 'icon-settings',
      requiresAuth: true,
      roles: ['Admin'],
    },
  }
];
