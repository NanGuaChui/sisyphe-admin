import login from '@/api/login';
import baseInfo from '@/api/baseInfo';
import Cookies from 'js-cookie';
import utils from '@/utils';

const user = {
    state: {
        userName: Cookies.get('userName'),
        userCode: Cookies.get('userCode'),
        station: [],
        scopeStations: [],
        currentStation: {
            stationCode: Cookies.get('currentStationCode'),
            stationName: Cookies.get('currentStationName')
        }
        // menus: []
    },

    mutations: {
        SET_USER_CODE: (state, userCode) => {
            state.userCode = userCode;
        },
        SET_USER_NAME: (state, userName) => {
            state.userName = userName;
        },
        SET_STATION: (state, station) => {
            state.station = station;
        },
        SET_SCOPE_STATIONS: (state, scopeStations) => {
            state.scopeStations = scopeStations;
        },
        SET_CURRENT_STATIONS: (state, currentStation) => {
            state.currentStation = currentStation;
        }
        // SET_MENUS: (state, menus) => {
        //     state.menus = menus;
        // }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim();
            return new Promise((resolve, reject) => {
                login
                    .login(username, userInfo.password)
                    .then(res => {
                        commit('SET_USER_NAME', Cookies.get('userName'));
                        commit('SET_USER_CODE', Cookies.get('userCode'));
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                Promise.all([baseInfo.getStation(), login.getScopeStation(state.userCode), login.findMenu()]).then(res => {
                    commit('SET_STATION', res[0]);
                    commit('SET_SCOPE_STATIONS', res[1]);
                    // commit('SET_MENUS', res[2]);
                    resolve(res);
                }, reject);
            });
        },

        // 登出
        LogOut({ commit, state }) {
            return new Promise(resolve => {
                utils.clearCookie();
                resolve();
            });
        },

        // 设置当前站点
        SetCurrentStation({ commit, state }, currentStation) {
            commit('SET_CURRENT_STATIONS', currentStation);
        }
    }
};

export default user;
