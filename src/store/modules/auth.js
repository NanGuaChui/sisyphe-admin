const auth = {
    state: {
        toggle: false,
        authorizeKey: null
    },
    mutations: {
        SET_SHOW_MODAL: state => {
            state.toggle = true;
        },
        SET_HIDE_MODAL: state => {
            state.toggle = false;
        },
        SET_KEY: (state, authorizeKey) => {
            state.authorizeKey = authorizeKey;
        }
    },

    actions: {
        // 展示权限登录窗
        ShowModal({ commit }) {
            return new Promise(resolve => {
                commit('SET_SHOW_MODAL');
                resolve();
            });
        },
        HideModal({ commit }) {
            return new Promise(resolve => {
                commit('SET_HIDE_MODAL');
                resolve();
            });
        },
        SetAuthorizeKey({ commit }, authorizeKey) {
            return new Promise(resolve => {
                commit('SET_KEY', authorizeKey);
                resolve();
            });
        },
        ClearAuthorizeKey({ commit }) {
            return new Promise(resolve => {
                commit('SET_KEY', null);
                resolve();
            });
        }
    }
};

export default auth;
