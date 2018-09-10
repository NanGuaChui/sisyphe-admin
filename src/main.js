import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css

import App from '@/App';
import router from '@/router';
import store from '@/store';

import '@/icons'; // icon
import '@/permission'; // permission control

Vue.use(ElementUI);

// 增加快捷弹出提示框的代码
Vue.prototype.$tips = {
    success: (content, title, beforeClose) => {
        ElementUI.MessageBox.alert(content, title, { type: 'success', beforeClose: beforeClose });
    },
    warn: (content, title, beforeClose) => {
        ElementUI.MessageBox.alert(content, title, { type: 'warning', beforeClose: beforeClose });
    },
    error: (content, title, beforeClose) => {
        ElementUI.MessageBox.alert(content, title, { type: 'error', beforeClose: beforeClose });
    }
};

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
