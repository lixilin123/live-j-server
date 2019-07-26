/**
 * 文件描述：记录错误日志的中间件
 */

const fs = require('fs');
const path = require('path');
const wstream = fs.createWriteStream(path.join(__dirname, '../log/error-log.txt'), {flags: 'w'});
const errorLog = async (err, ctx) => {
    let errorInfo = ``;
    try {
        errorInfo = `[${new Date().toLocaleString()}] 错误信息:${err.message} 地址:${ctx.url} 方式:${ctx.method} 参数:${ctx.querystring || JSON.stringify(ctx.body)}\n`;
    } catch(e) {
        errorInfo = `[${new Date().toLocaleString()}] 错误信息:${e.message}\n`
    }
    wstream.write(errorInfo)
};

module.exports = { errorLog };