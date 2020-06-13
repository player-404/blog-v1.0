const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resmodel');
const { setKey, getKey } = require('../db/redis');
//用户登录接口
const userHandle = (req, res) => {
    const path = req.url.split('?')[0];
    const method = req.method;
    console.log('进入');    
    if (method === 'POST' && path === '/api/user/login') {
        const { username, password } = req.body;
        console.log("数据 =>", req.body);
        
        //数据库验证数据
        const result = login(username, password);
        return result.then(data => {
            if (data) {
                console.log('登录session =>', data);
                //同步到redis
                setKey(req.sessionId, data);
                return Promise.resolve(new SuccessModel('登录成功'));
            }
            return Promise.resolve(new ErrorModel('登录失败'));
        })
    }
    //登录测试页面
    /* if (method === 'GET' && path === '/api/user/login-test') {
        console.log('session =>', req.session.username);

        if (req.session.username) {
            return Promise.resolve(new SuccessModel('验证成功'));
        }
        return Promise.resolve(new ErrorModel('尚未登录'));
    } */
}

module.exports = userHandle;