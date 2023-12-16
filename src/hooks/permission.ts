/*
 * @Date: 2023-07-14 14:13:43
 * @LastEditors: zbx
 * @LastEditTime: 2023-07-20 09:13:57
 * @descript: 文件描述
 */
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

export const hasOneOf = (targetarr, arr) => {
    return targetarr.some(_ => arr.indexOf(_) > -1)
}

const hasPermission = (routeItem: RouteLocationNormalized | RouteRecordRaw, access: string[]) => {
    if (routeItem.meta && routeItem.meta.roles && routeItem.meta.roles.length) {
        return routeItem.meta?.roles?.includes('*') || hasOneOf(access, routeItem.meta.roles)
    }
    else return true
}

export default hasPermission