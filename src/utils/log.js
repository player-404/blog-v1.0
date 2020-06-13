const fs = require('fs');
const path = require('path');
//创建流
function createWriteStream(filename) {
    const fullnamae = path.join(__dirname, '../', '../', 'logs', filename);
    const writeStream = fs.createWriteStream(fullnamae, {flags:'a'});
    return writeStream;
}
//写入日志
function writeLog(stream,log) {
    stream.write(log + '\n');
}

//创建访问流
const assStream = createWriteStream('access.log');

//访问日志
function asscess(log) {
    writeLog(assStream, log);
}

module.exports = {
    asscess
}