import router from '@/router';
import store from '@/store';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式
import { Message } from 'element-ui';

const whiteList = ['/login']; // 不重定向白名单
router.beforeEach((to, from, next) => {
    NProgress.start();
    // 先判断是否存在userCode来判断是否登录,然后scopeStations是权限站点列表 没有scopeStations不能登录
    if (store.getters.userCode) {
        if (to.path === '/login') {
            next({ path: '/' });
            NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            const scopeStations = store.getters.scopeStations;
            if (!scopeStations || scopeStations.length < 1) {
                // 如果没有权限站点
                store
                    .dispatch('GetInfo') // 拉取用户信息
                    .then(userInfo => {
                        const menus = userInfo[2];
                        store.dispatch('GenerateRoutes', { menus }).then(() => {
                            // 根据scopeStations权限生成可访问的路由表
                            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
                            next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                        });
                    })
                    .catch(() => {
                        store.dispatch('LogOut').then(() => {
                            Message.error('没有获取到权限站点');
                            next({ path: '/login' });
                        });
                    });
            } else {
                // 可以在此处判断菜单的权限
                // 没有设置symbol的默认可以进入(特制全局页面)
                // 授权并使用 1000  直接使用 0100  提供授权 0010  授权后使用 0001
                const auth = to.meta.symbol || '0100';
                if (auth === '0100' || auth === '1000' || auth === '0011') {
                    next();
                } else if (auth === '0001') {
                    // 授权后使用的页面
                    if (store.getters.authorizeKey) {
                        store.dispatch('ClearAuthorizeKey');
                        next();
                    } else {
                        next({ path: '/authorization', replace: true, query: { toPath: to.path, jurisdictionCode: to.meta.jurisdictionCode } });
                    }
                } else {
                    next({ path: '/401', replace: true, query: { noGoBack: true } });
                }
                // 可删 ↑
            }
        }
    } else {
        if (whiteList.indexOf(to.path) > -1) {
            next();
        } else {
            next('/login');
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done(); // 结束Progress
});
