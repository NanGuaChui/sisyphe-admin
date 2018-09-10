import { asyncRouters, constantRouterMap } from '@/router';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param menus
 * @param route
 */
function hasPermission(route, menus) {
    if (!route.meta) {
        route.meta = {};
    }
    // 不存在CODE则直接显示
    if (route.meta.code) {
        // 查找CODE
        return menus.some(role => {
            // 如果权限包含该CODE   还需要设置路径的访问权限
            // 授权并使用 1000  直接使用 0100  提供授权 0010  授权后使用 0001
            const symbol = role.symbol;
            if (role.code.indexOf(route.meta.code) >= 0 && (symbol === '1000' || symbol === '0100' || symbol === '0001')) {
                route.meta.symbol = role.symbol;
                route.meta.jurisdictionCode = role.jurisdictionCode;
                return true;
            }
        });
    } else {
        // 前端未设置code的页面  提供直接使用
        route.meta.symbol = '0100';
        return true;
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param menus
 */
function filterAsyncRouter(asyncRouterMap, menus) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(route, menus)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, menus);
            }
            return true;
        }
        return false;
    });
    return accessedRouters;
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { menus } = data;
                // if (menus.indexOf("admin") >= 0) {
                //   accessedRouters = asyncRouterMap();
                // } else {
                //   accessedRouters = filterAsyncRouter(asyncRouterMap(), menus);
                // }
                const accessedRouters = filterAsyncRouter(asyncRouters, menus);
                commit('SET_ROUTERS', accessedRouters);
                resolve();
            });
        }
    }
};

export default permission;
