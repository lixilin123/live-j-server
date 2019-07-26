/**
 * 文件描述：读取软件更新内容的中间件
 */
const fs = require('fs');
const path = require('path');

// 检测重置密码URL
const updateContent = async ctx => {
    const updateContentJson = fs.readFileSync(path.join(__dirname, '../static/download/update-content.json'));
    ctx.response.type = 'json';
    ctx.response.body = updateContentJson;
}

module.exports = updateContent;