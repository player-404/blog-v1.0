const { exec, escape } = require('../db/mysql');

function login(username, password) {    
    username = escape(username);  //转义sql语句中特殊字符 (方sql注入攻击)
    password = escape(password);
    let sql = `SELECT username FROM users WHERE username=${username} AND password=${password}`;
    return exec(sql).then(data => {
       return data[0];
    })
}

module.exports = {
    login
}