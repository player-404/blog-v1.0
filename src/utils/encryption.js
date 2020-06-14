const cryoto = require('crypto');
const secret_key = 'demo_key';

//md5加密
function md5(content) {
    const hash = cryoto.createHash('md5');
    return hash.update(content).digest('hex'); //hex 以二进制输出
}

//加密
function cry(password) {
    const str = `password=${password}&key=${secret_key}`;
    return md5(str);
}

module.exports = {
    cry
}