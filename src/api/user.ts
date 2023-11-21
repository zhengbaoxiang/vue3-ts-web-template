/*
 * @Date: 2023-07-14 14:13:43
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-11 11:18:13
 * @descript: 文件描述
 */
import { AnyObject } from '@/types/global';
import axios from 'axios';
export interface LoginData {
  username: string;
  password: string;
}

// 函数
export function login(data: LoginData) {
  return axios.post('/user/login', data);
}
// 函数赋值变量
export const logout = () => {
  return axios.post('/user/logout');
}
export function getUserInfo() {
  return axios.post('/user/getUserInfo');
}
export function getAccountAndAutoOnline(data: { "autoOnline": boolean }) {
  return axios.post('/user/getAccountAndAutoOnline', data);
}
export function getAccounts(data: { "autoOnline": boolean }) {
  return axios.post('/user/getAccounts', data);
}
export function getOffline(data: { accountId: string }) {
  return axios.post('/user/getOffline', data);
}
export function getOnline(data: { accountId: string }) {
  return axios.post('/user/getOnline', data);
}
export function GetPassportUsers(data: { keyword: string }) {
  return axios.post('/user/GetPassportUsers', data);
}
export function StartChat(data: AnyObject) {
  return axios.post('/user/StartChat', data);
}

export function IsUserCanceled(data: AnyObject) {
  return axios.post('/user/IsUserCanceled', data);
}

