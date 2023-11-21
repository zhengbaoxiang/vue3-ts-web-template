import { RealMsg } from "@/store/msgParse";

/*
 * @Date: 2023-07-14 14:13:44
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-11 11:20:05
 * @descript: 文件描述
 */
export interface AccountInfo {
  AccountName: string,
  BanedGroup: string,
  Description: string,
  ImUserId: string,
  IsCanceled: false,
  IsDel: false,
  OccupiedUser: string,
  OccupiedUserId?: string | null,
  OccupiedUserName?: string | null,
  OfflineTotalCount: number,
  PassportId: string,
  PermittedGroup: string,
  State: number,

  accAvatar?: string
}


export interface ChatInfo {
  ImId: string,
  IsNotDisturbed: false,
  IsSetTop: false,
  LatestMsg: {
    Content: string,
    ContentType: number,
    MsgIndexID: number,
    SendDateTime: number,
    SenderName: string,
  },
  OfflineMessageCount: number,
  PassportId: string,
  SendDateTime?: 0,
  SenderName?: any,
  AccountName?: any,
}
export interface UserInfo {
  imuserId: string,
  isNotDisturbed: boolean,
  isSetTop: boolean,
  islater?: boolean,
  isCanceled?: boolean

  unread: number,
  passportId: string,
  msgIndexID: number

  newestMsgTxt: string,
  sendDateTime: number,
  sendDateTimeStr?: string,

  userName: string,
  userAvatar: string,

  recordList: RealMsg[],
  quto: AnyObject | null,
  key: string
}


export interface AnyObject {
  [key: string]: any;
}
export interface AnyList {
  [key: number]: any;
}
export interface Options {
  value: unknown;
  label: string;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface GetParams {
  body: null;
  type: string;
  url: string;
}

export interface PostData {
  body: string;
  type: string;
  url: string;
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export type TimeRanger = [string, string];

export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}

export interface Msg {
  msg: string;
}
