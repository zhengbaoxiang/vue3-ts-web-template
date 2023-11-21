/*
 * @Date: 2023-07-14 14:13:44
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-15 11:28:29
 * @descript: 文件描述
 */
import { defineStore } from 'pinia';
import { login as userLogin, logout as userLogout, getUserInfo } from '@/api/user';
import { getToken, setToken, clearToken, getAvator } from '@/utils/tools';

import { useComStore } from '@/store';
import config from '@/config';

interface userInfoType {
  ImUserId: string,
  Password: string,
  PermittedAccounts: string[],
  PhoneNumber: string,
  RealName: string,
  Remark: string,
  WorkNumber: string,
  UserRole: string,

  role?: string,
  avatar?: string,
  hasGetInfo?: boolean,
}

const useUserStore = defineStore('user', {
  state: (): userInfoType => ({
    ImUserId: '',
    Password: '',
    PermittedAccounts: [],
    PhoneNumber: '',
    RealName: '',
    Remark: '',
    WorkNumber: '',
    UserRole: '',

    role: '',
    avatar: '',
    hasGetInfo: false,
  }),
  getters: {
    userInfo(state: userInfoType) {
      return { ...state };
    },
  },
  actions: {
    // Get user's information 鉴权接口，根据token,拿到用户信息，
    async info() {
      try {
        const res = await getUserInfo();
        this.setInfo(res.data);
      } catch (err) {
        // this.role = 'admin' // 调试开启
        throw err; // 不报错则越过鉴权
      }
    },
    // Set user's information
    setInfo(data: Partial<userInfoType>) {
      // 解析用户信息，构造权限数组，自定义字段等
      this.hasGetInfo = true;
      this.role = data.UserRole; // User   Auditor    Admin
      // this.avatar = getAvator(data.PassportId)
      this.avatar = 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'

      // 它允许你用一个 state 的补丁对象在同一时间更改多个属性：
      this.$patch(data);
      this.start_comStore(data)
    },
    start_comStore(data: any) {
      const comStore = useComStore();
      comStore.currentAccount = {}
      comStore.start_loginIM(data)
    },
    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Login
    async login(loginForm: any) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.Token || res.data);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    // Logout
    async handleLogOut() {
      const token = getToken()
      const comStore = useComStore();
      comStore.closeIM()
      // 清理数据
      this.resetInfo();
      clearToken();

      // 接口退出
      // await userLogout();

      // 链接登出
      const userType = 'oa'
      const url = `${config.logoutUrl}?token=${token}&userType=${userType}`;
      window.location.href = url;

      return Promise.resolve(token)
    },
  },
});

export default useUserStore;
