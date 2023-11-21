/*
 * @Date: 2023-07-14 14:13:44
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-16 11:14:44
 * @descript: 文件描述
 */
export interface AppState {
  theme: string;
  colorWeek: boolean;
  navbar: boolean;
  menu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  [key: string]: unknown;
}
