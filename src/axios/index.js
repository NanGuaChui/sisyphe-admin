import utils from '@/utils';
import axios from 'axios';

// 创建axios实例
const service = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://192.168.21.141:17001/', // api的base_url
    // baseURL: process.env.BASE_API, // api的base_url
    timeout: 15000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    }
});

// request拦截器
service.interceptors.request.use(config => {
    utils.toggleLoading(1);
    return config;
});

// respone拦截器
service.interceptors.response.use(
    res => {
        console.log('请求response', res);
        utils.toggleLoading(-1);
        const data = res.data;
        // 登陆的时候会返回errcode 成功为0
        if (data.code !== '000' && data.errcode !== '0') {
            return Promise.reject({ code: data.code || -1, message: data.message || data, res: res.data });
        }
        return data.result;
    },
    err => {
        utils.toggleLoading(-1);
        const res = err.response;
        if (res && res.data) {
            console.log(res.data.message || res.statusText);
            return Promise.reject({ code: res.data.code, message: res.data.message || res.statusText, res: res.data });
        } else {
            return Promise.reject({ code: '500', message: err.message || err || '程序错误' });
        }
    }
);

export default service;
