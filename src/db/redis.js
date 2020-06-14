const redis = require('redis');
//引入配置
const { REDIS_CONFIG } = require('../conf/db');
//创建客户端
const client = redis.createClient();
//监听错误
client.on('error', (err) => {
    throw err;
})
//redis设置键值对
function setKey(key, val) {
    //redis字符串设置的值必须是字符串
    if (typeof (val) === 'object') {
        val = JSON.stringify(val);
    }
    client.set(key, val, redis.print); //redis.print ==> 输出设置的结果
}
//reids获取键值对
function getKey(key) {
    
    return new Promise((res, rej) => {
        client.get(key, (err, reply) => {
            console.log('reply =>', reply);
            console.log('err =>', err);
            
            if (err) {
                rej(err);
                return;
            }
            if (reply == null) {
                rej(null);
                return;
            }
            try {
                res(JSON.parse(reply)); //将取出的字符串数据重新转换为对象
            } catch (err) {
                res(reply);
            }
        })
    })
}
// client.quit 结束进程 在这里使用单例模式，让redis进程一直运行，避免频繁的重启，以免影响负服务器的性能

module.exports = {
    setKey,
    getKey
}