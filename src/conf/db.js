//环境变量
const env = process.env.NODE_ENV;
console.log('env =>', env);

let MYSQL_CONFIG;
let REDIS_CONFIG;
if (env === 'production') {
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: '12138',
        database: 'myblog'
    }
    REDIS_CONFIG = {
        host: '127.0.0.1',
        port: 6379
    }
    
}

if (env === 'dev') {
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: '12138',
        database: 'myblog'
    }
    REDIS_CONFIG = {
        host: '127.0.0.1',
        port: 6379
    }
}

module.exports = {
    MYSQL_CONFIG,
    REDIS_CONFIG
}

