/*
 * @Date: 2023-11-20 15:27:57
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-21 15:52:52
 * @descript: 文件描述
 */
/// <reference types="vite/client" />

// 能让ts认识.vue文件的类型声明文件
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

