/**
 * 文件描述：登录中间件
 */

const query = require('../mysql/mysql.js');
const md5 = require('md5');
const jwt = require('jwt-simple');
const errorGenerator = require('../lib/error.js');
// 登录服务
const signIn = async ctx => {
    // 获取请求参数
    const { email, password } = ctx.request.body;
    // 根据roomid，查询数据库
    let sql1 = `SELECT id,password,salt FROM user WHERE email = '${email}'`;
    const res = await query(sql1);
    let resBody = {};
    if(!res[0]) {
        resBody = errorGenerator(4002);
    } else if (md5(`${password}${res[0]['salt']}bilibilimd5secretkey`) == res[0]['password']) {
        // 下发token
        const expire = new Date().getTime() + 2592000000;
        const token = tokenGenerator(res[0]['id'], expire);
        resBody = {
            code: 0,
            data: {token}
        }
    } else {
        resBody = errorGenerator(4003)
    }
    ctx.response.type = 'json';
    ctx.response.body = resBody;
}

// token生成器函数
const tokenGenerator = (uid, expire) => {
    const tokenPayload = { uid, expire };
    const secret = 'bilibilitokensecretkey';
    const token = jwt.encode(tokenPayload, secret);
    return token;
}

module.exports = signIn;