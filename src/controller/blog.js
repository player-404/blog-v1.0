const { exec, escape } = require('../db/mysql');
let xss = require('xss');

//博客列表
function getList(keywords, autor) {
    let sql = `SELECT * FROM blogs WHERE 1=1 `; 
    if (autor) {
        sql += `AND autor='${autor}'`;
    }
    if (keywords) {
        sql += `AND keywords='${keywords}'`;
    }
    return exec(sql);
}
//博客详情
function getDetiles(id) {
    let sql;
    if (id) {
        sql = `SELECT * FROM blogs WHERE id=${id}`;
    }
    return exec(sql);
}
//创建博客
function newBlog(postData = {}) {
    const title = xss(postData.title); // 防xss攻击
    const content = xss(postData.content); // 防xss攻击
    const createtime = Date.now();
    let sql;
    if (title && content && createtime) {
        title = escape(title);
        content = escape(content);
        sql = `INSERT INTO blogs (title, content, createtime) values (${title},${content},'${createtime}')`;
    }
     return exec(sql).then(data => {
         if (data.affectedRows > 0) {
             return true;
         }
         return false;
     }, err => {
         return false;
     })
}
//更新博客
function update(id, postData = {}) {
    console.log('更新博客的id =>', id);
    
    let sql;
    const title = xss(postData.title); //防xss攻击
    const content = xss(postData.content); //防xss攻击
    const createtime = Date.now();
    console.log('id =>', id, 'title=>', title, 'content =>', content, 'createtime =>', createtime);
    console.log('type', typeof(createtime));
    
    if (id && title && content && createtime) {
        console.log('更新博客查询语句创建');
        title = escape(title); //防sql注入
        content = escape(content); //防sql注入
        sql = `UPDATE blogs SET title=${title}, content=${content}, createtime='${createtime}' WHERE id='${id}'`;
    }
    return exec(sql).then(data => {
        console.log('更新博客的日志 =>', data);
        
        if (data.affectedRows > 0) {
            return true;
        }
        return false;
    }, err => {
        console.log('更新博客的错误日志 =>', err);
        
        return false;
    })
}
//删除博客
function del(id) {
    let sql;
    if (id) {
        sql = `DELETE FROM blogs WHERE id='${id}'`;
    }
    return exec(sql).then(data => {
        if (data.affectedRows > 0) {
            return true;
        }
        return false
    }, err => {
        return false;
    })
}

module.exports = {
    getList,
    getDetiles,
    newBlog,
    update,
    del
}