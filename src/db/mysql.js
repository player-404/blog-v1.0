//数据库查询
const {MYSQL_CONFIG} = require('../conf/db');
const mysql = require('mysql');

//创建数据据连接
const con = mysql.createConnection(MYSQL_CONFIG);
//开始连接
con.connect();

function exec(sql) {
   return new Promise((res, rej) => {
       con.query(sql, (err, data) => {

           if (err) {
               rej(err);
               return;
           }
           res(data);
       })
   })
}

module.exports = {
    exec,
    escape: mysql.escape //防sql注入函数 该函数为mysql自带函数 防sql注入即是将特殊字符进行转义
}