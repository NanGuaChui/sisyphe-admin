import axios from '@/axios';
import utils from '@/utils';

export default {
    login(username, password) {
        return axios.post('/sys/doLogin', utils.param({ username, password }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'login-type': 'AppLogin'
            }
        });
    },
    getScopeStation(userCode) {
        return new Promise((resolve, reject) => {
            return axios.get('/oauth/api/oauth/user/findUserManagementScope?userCode=' + userCode).then(res => {
                resolve(res.scopeStations);
            }, reject);
        });
    },
    logout() {
        return axios({
            url: '/user/logout',
            method: 'post'
        });
    },
    findMenu() {
        return new Promise((resolve, reject) => {
            axios({
                url: '/oauth/api/oauth/jurisdiction/findJurisdictionByUserCodeAndSystemSymbol?userCode=YGADMIN&systemSymbol=NOT_HY_AND_NOT_CZK',
                method: 'get'
            }).then(res => {
                const menu = res.jurisdictionList.map(item => {
                    return { code: item.urlAddress, symbol: item.symbol, jurisdictionCode: item.jurisdictionCode };
                });
                resolve(menu);
            }, reject);
        });
    }
};
