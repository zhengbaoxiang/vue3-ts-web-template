/*
 * @Date: 2023-07-14 14:13:43
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-11 11:18:13
 * @descript: 文件描述
 */
import { AnyObject } from '@/types/global';
import axios from 'axios';
import myAxios from '@/api/myAxios';

export interface LoginData {
  username: string;
  password: string;
}

// 函数
export function login(data: LoginData) {
  return myAxios.post('/user/login', data);
}
// 函数赋值变量
export const logout = () => {
  return myAxios.post('/user/logout');
}
export function getUserInfo() {
  return myAxios.post('/user/getUserInfo');
}
export function getAccountAndAutoOnline(data: { "autoOnline": boolean }) {
  return myAxios.post('/user/getAccountAndAutoOnline', data);
}
export function getAccounts(data: { "autoOnline": boolean }) {
  return myAxios.post('/user/getAccounts', data);
}
export function getOffline(data: { accountId: string }) {
  return myAxios.post('/user/getOffline', data);
}
export function getOnline(data: { accountId: string }) {
  return myAxios.post('/user/getOnline', data);
}
export function GetPassportUsers(data: { keyword: string }) {
  return myAxios.post('/user/GetPassportUsers', data);
}
export function StartChat(data: AnyObject) {
  return myAxios.post('/user/StartChat', data);
}

export function IsUserCanceled(data: AnyObject) {
  return myAxios.post('/user/IsUserCanceled', data);
}

