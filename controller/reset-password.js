/**
 * 文件描述：重置密码中间件
 */

const { debug } = require('../lib/config.js');
const query = require('../mysql/mysql.js');
const jwt = require('jwt-simple');
const errorGenerator = require('../lib/error.js');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');

// 创建重置密码URL
const createResetPasswordUrl = async ctx => {
    let resBody = {};
    // 获取请求参数
    const { email } = ctx.request.body;
    // 判断邮箱是否存在
    let sql1 = `SELECT id FROM user WHERE email = '${email}'`;
    const res = await query(sql1);
    if (!res[0]) {
        resBody = errorGenerator(4101);
    } else {
        const expire = new Date().getTime() + 10 * 60 * 1000;
        const token = tokenGenerator(res[0]['id'], expire);
        resBody = {
            code: 0,
            data: {
                url: `http://${debug ? '10.10.28.162:3001' : 'www.yishisi.cn:8321'}/account/checkResetPasswordUrl?token=${token}`
            }
        }
    }

    ctx.response.type = 'json';
    ctx.response.body = resBody;
}

// 检测重置密码URL
const checkResetPasswordUrl = async ctx => {
    // 获取请求参数
    const { token } = ctx.request.query;
    try {
        const { uid, expire } = jwt.decode(token, 'bilibiliresetpasswordsecretkey');
        if(new Date() >= new Date(+expire)) {
            ctx.response.type = 'text';
            ctx.response.body = '该链接已过期';
        } else {
            const bodyHtml = fs.readFileSync(path.join(__dirname, '../static/reset-password.html'));
            ctx.response.type = 'html';
            ctx.response.body = bodyHtml;
        }
    } catch(e) {
        ctx.response.type = 'text';
        ctx.response.body = '错误的链接';
    }
}

// 重置密码
const resetPassword = async ctx => {
    let resBody = {};
    // 获取请求参数
    const { token, password } = ctx.request.query;
    try {
        const { uid, expire } = jwt.decode(token, 'bilibiliresetpasswordsecretkey');
        if(new Date() >= new Date(+expire)) {
            resBody = errorGenerator(4201);
        } else {

            // 随机盐值
            const salt = Math.random().toString().slice(2, 10);
            // md5密码
            const md5Password = md5(`${password}${salt}bilibilimd5secretkey`);
            // 更改数据库
            let sql1 = `UPDATE user SET password = '${md5Password}', salt='${salt}' WHERE id = '${uid}' `;
            await query(sql1);
            resBody = {code: 0, data: ''};

        }
    } catch(e) {
        resBody = errorGenerator(4202);
    }
    ctx.response.type = 'json';
    ctx.response.body = resBody;
}

// token生成器
const tokenGenerator = (uid, expire) => {
    const tokenPayload = { uid, expire };
    const secret = 'bilibiliresetpasswordsecretkey';
    const token = jwt.encode(tokenPayload, secret);
    return token;
}

module.exports = { createResetPasswordUrl, checkResetPasswordUrl, resetPassword };