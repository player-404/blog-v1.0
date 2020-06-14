//博客接口
const blogHandle = require('./src/router/blog');
//登录接口
const userHandle = require('./src/router/user');
const querystring = require('querystring');
const { asscess } = require('./src/utils/log');

function getExpiresTime() {
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    return d.toGMTString();
}
//redis
const { setKey, getKey } = require('./src/db/redis');
//处理post数据
const getPostData = (req, res) => {
    
    return new Promise((res, rej) => {
        if (req.method != 'POST') {
            res({});
            return;
        }
        if (req.headers['content-type'] != 'application/json') { //请求提交的数据为json格式
            res({});
            return;
        }
        let postData = '';
        req.on('data', chunk => {
            console.log('chunk =>', chunk);
            
            postData += chunk;
        })
        req.on('end', () => {
            if (!postData) {
                res({});
                return;
            }
            console.log('postData =>', postData);
            // console.log('type =>', typeof (postData));

            res(JSON.parse(postData));
        })
    })
}

const serverHandle = (req, res) => {
    console.log(123);
    
    asscess(`${req.url} -- ${req.method} -- ${req.headers['user-agent']} -- ${new Date()}`)
    res.setHeader('Content-type', 'application/json');
    req.query = querystring.parse(req.url.split('?')[1]);

    //解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if (!item) return;
        const arr = item.split('=');    
        //去空格
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    })

    //解析session
    //每次刷新页面，httpCreateServer中的回调函数都会重新执行
    //userid 用来控制用户身份过期
    //当 userid 过期 会吧 session 清空为空对象 ，这时候便会要求重新登录
    let userId = req.cookie.userid;
    let needCookie = false;
    //userId不存在 未登录 登录过期
    if (!userId) {
        userId = Date.now() + '_' + Math.random();
        needCookie = true;
        //初始化 redis中的 session 的值
        setKey(userId, {});
    }
    //获取seesion
    req.sessionId = userId;
    getKey(req.sessionId).then(data => {
        console.log('执行 =>', data);

        if (data == null) {
            // 初始化session
            setKey(req.sessionId, {});
            // 设置req.session (验证是否登录的对象 受 cookie中的userid影响)
            req.session = {};
        } else {
            console.log('redis数据 =>', data.username);
            
            req.session = data;
        }
        return getPostData(req,res);
    }, (err) => {
        console.log(err);
    })
    .then(postData => {   
        //处理post数据
        req.body = postData;    
        //博客接口处理
        const blogResult = blogHandle(req, res);
        if (blogResult) {
            blogResult.then(data => {
                if (needCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; httpOnly; path=/; expirse=${getExpiresTime()}`)
                }
                res.end(JSON.stringify(data));
            })
            return;
        }
        //登录接口处理
        const userData = userHandle(req, res);
        if (userData) {
            userData.then(data => {
                if (needCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; httpOnly; path=/; expires=${getExpiresTime()}`)
                }
                res.end(JSON.stringify(data));
            })
            return;
        }
        //访问出错
        res.writeHead(404, { 'Contentl-type': 'text/plain' }); //设置响应头，如果没有设置会自动设置
        res.write('404 not found');
        res.end();
    })
}

module.exports = serverHandle;