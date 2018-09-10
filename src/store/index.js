import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import tagsView from './modules/tagsView';
import permission from './modules/permission';
import auth from './modules/auth';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        user,
        tagsView,
        permission,
        auth
    },
    getters
});

export default store;
