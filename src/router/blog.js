const { getList,
    getDetiles,
    newBlog,
    update,
    del } = require('../controller/blog');
const { ErrorModel, SuccessModel } = require('../model/resmodel');
const loginCheck = function(req, res) {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'));
    }
}

//博客接口
const blogHandle = (req, res) => {
    const method = req.method;
    const path = req.url.split('?')[0];
    console.log(path, method);

    //列表
    if (method === 'GET' && path === '/api/blog/list') {
        //登录验证
        const loginResult = loginCheck(req);
        if (loginResult) {
            return loginResult;
        }
        const result = getList(req.query.keyWords, req.query.autor);
        console.log('result =>', result);

        return result.then(data => {
            return new SuccessModel(data);
        }, err => {
            return new ErrorModel(err);
        })
    }

    //详情
    if (method === 'GET' && path === '/api/blog/detils') {
        //登录验证
        const loginResult = loginCheck(req);
        if (loginResult) {
            return loginResult;
        }
        const id = req.query.id;
        const result = getDetiles(id);
        console.log('详情数据 =>', result);

        return result.then(data => {
            console.log('详情 =>', data);

            return new SuccessModel(data);
        }, err => {
            console.log('错误 =>', err);

            return new ErrorModel(err, '数据获取失败');
        })
    }

    //创建
    if (method === 'POST' && path === '/api/blog/new') {
        //登录验证
        const loginResult = loginCheck(req);
        if (loginResult) {
            return loginResult;
        }
        const postData = req.body;
        const result = newBlog(postData);
        return result.then(data => {
            console.log('创建博客data =>', data);
            if (data) {
                return new SuccessModel('创建博客成功');
            }
            return new ErrorModel('创建博客失败');
        })
    }

    //更新
    if (method === 'POST' && path === '/api/blog/update') {
        //登录验证
        const loginResult = loginCheck(req);
        if (loginResult) {
            return loginResult;
        }
        const result = update(req.query.id, req.body);
        return result.then(data => {
            if (data) {
                return new SuccessModel('更新博客成功');
            }
            return new ErrorModel('更新博客失败');
        })
    }

    //删除
    if (method === 'GET' && path === '/api/blog/del') {
        //登录验证
        const loginResult = loginCheck(req);
        if (loginResult) {
            return loginResult;
        }
        const result = del(req.query.id);
        return result.then(data => {
            if (data) {
                return new SuccessModel('删除博客成功');
            }
            return new ErrorModel('删除博客失败');
        })
    }
}

module.exports = blogHandle;