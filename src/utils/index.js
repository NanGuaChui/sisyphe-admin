/**
 * Created by jiachenpan on 16/11/18.
 */
import { Loading } from 'element-ui';
import store from '@/store';
import Cookies from 'js-cookie';

export default {
    host: { shelf: 'http://192.168.21.87:18818' },
    load: { amount: 0, dialog: null },
    toggleLoading(calculate) {
        this.load.amount += calculate;
        setTimeout(() => {
            if (this.load.amount <= 0) {
                this.load.dialog.close();
            } else {
                this.load.dialog = Loading.service();
            }
        });
    },
    station: {
        hadquarters: { text: '总部', code: 'HDQA00' },
        online: { text: '在线', code: 'CHNA00' }
    },
    parseTime(time, cFormat) {
        if (arguments.length === 0) {
            return null;
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
        let date;
        if (typeof time === 'object') {
            date = time;
        } else {
            if (('' + time).length === 10) time = parseInt(time) * 1000;
            date = new Date(time);
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        };
        const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key];
            if (key === 'a') {
                return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
            }
            if (result.length > 0 && value < 10) {
                value = '0' + value;
            }
            return value || 0;
        });
        return time_str;
    },
    formatTime(time, option) {
        // 格式化时间
        time = +time * 1000;
        const d = new Date(time);
        const now = Date.now();

        const diff = (now - d) / 1000;

        if (diff < 30) {
            return '刚刚';
        } else if (diff < 3600) {
            // less 1 hour
            return Math.ceil(diff / 60) + '分钟前';
        } else if (diff < 3600 * 24) {
            return Math.ceil(diff / 3600) + '小时前';
        } else if (diff < 3600 * 24 * 2) {
            return '1天前';
        }
        if (option) {
            return this.parseTime(time, option);
        } else {
            return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
        }
    },
    param(json) {
        // 转换参数为键值对
        if (!json) return '';
        return this.cleanArray(
            Object.keys(json).map(key => {
                if (json[key] === undefined) return '';
                return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
            })
        ).join('&');
    },
    param2Obj(url) {
        // 转参数为对象
        const search = url.split('?')[1];
        if (!search) {
            return {};
        }
        return JSON.parse(
            '{"' +
                decodeURIComponent(search)
                    .replace(/"/g, '\\"')
                    .replace(/&/g, '","')
                    .replace(/=/g, '":"') +
                '"}'
        );
    },
    cleanArray(actual) {
        // 不知道啥用
        const newArray = [];
        for (let i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    },
    // 根据val获取text
    getTextByVal(arr, val) {
        if (!arr || !val) {
            return '';
        }
        const result = arr.find(item => {
            return item.value === val;
        });
        return result ? result.text : val;
    },
    // 获取站点名称
    getStationName(stationCode) {
        if (!stationCode) {
            return '';
        }
        const result = store.getters.station.find(item => {
            return item.stationCode === stationCode;
        });
        return result ? result.stationName : stationCode;
    },
    uuid(len, radix) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        const uuid = [];
        let i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
        } else {
            // rfc4122, version 4 form
            let r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | (Math.random() * 16);
                    uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    },
    inputPattern(val, type) {
        if (!type) {
            return val;
        } else if (type === 'Number') {
            val = val || '';
            console.log(val.replace(/\D/g, ''));
            return val.replace(/\D/g, '');
        }
    },
    clearCookie() {
        Object.keys(Cookies.getJSON()).forEach(item => {
            Cookies.remove(item);
        });
    },
    // 循环获取上传结果
    loopUploadRes(res) {
        return new Promise((resolve, reject) => {
            if (res.code !== '000') {
                reject({ code: res.code, message: res.message });
            } else {
                const uploadResult = res.result.uploadResult;
                if (uploadResult.status === 'Locked') {
                    reject({ code: res.code, message: '当前有其他人正在导入，请稍后再试！' });
                } else if (uploadResult.status === 'Finish' || uploadResult.status === 'Working') {
                    resolve(uploadResult);
                } else {
                    reject({ code: res.code, message: '导入返回意料之外的状态：' + uploadResult.status });
                }
            }
        });
    }
};
