import Mock from 'mockjs';
import loginAPI from './login';

Mock.setup({
    timeout: '350-600'
});

// 登录相关
Mock.mock(/\/api\/oauth\/jurisdiction\/findJurisdictionByUserCodeAndSystemSymbol/, 'get', loginAPI.findJurisdictionByUserCodeAndSystemSymbol);

export default Mock;
