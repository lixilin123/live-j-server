/**
 * 文件描述：注册中间件 
 */

const query = require('../mysql/mysql.js');
const md5 = require('md5');
const errorGenerator = require('../lib/error.js');
// 注册服务
const signUp = async ctx => {
    let resBody = {};
    // 获取请求参数
    const { username, roomid, email, password } = ctx.request.body;
    // 判断邮箱是否已被注册
    let sql1 = `SELECT * FROM user WHERE email = '${email}'`;
    const res = await query(sql1);
    if (res[0]) {
        resBody = errorGenerator(4001);
    } else {
        // 随机盐值
        const salt = Math.random().toString().slice(2, 10);
        // md5密码
        const md5Password = md5(`${password}${salt}bilibilimd5secretkey`);
        // 插入数据库
        let sql2 = `INSERT INTO user (name, room_id, email, password, salt) VALUES ('${username}', '${roomid}', '${email}', '${md5Password}', '${salt}')`;
        await query(sql2);
        resBody = {
            code: 0,
            data: ''
        }
    }
    ctx.response.type = 'json';
    ctx.response.body = resBody;
}

module.exports = signUp;