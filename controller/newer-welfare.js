/**
 * 文件描述：给新用户发放免费3天会员的中间件 
 */
const jwt = require('jwt-simple');
const query = require('../mysql/mysql.js');
const errorGenerator = require('../lib/error.js');

const newerWelfare = async ctx => {
    console.log('下发3天免费会员......')
    console.log(ctx.request.body);

    let resBody = {};
    const param = ctx.request.body;
    // 1.解析出uid
    try {
        const { uid } = jwt.decode(param.token, 'bilibilitokensecretkey');
        // 2.操作数据库
        const sql1 = `SELECT newer_welfare FROM user WHERE id = '${uid}'`;
        const res = await query(sql1);
        if (res[0]['newer_welfare']) {
            resBody = errorGenerator(4301);
        } else {
            const sql2 = `UPDATE user SET is_vip = '1', vip_end_time='${Math.floor((new Date(Date.now() + 259200000).getTime() / 1000))}', newer_welfare='1' WHERE id = '${uid}' `;
            await query(sql2);
            resBody = { code: 0, data: '' };
        }
    } catch (e) {
        resBody = errorGenerator(4000);
    }

    ctx.response.type = 'json';
    ctx.response.body = resBody;
}

module.exports = newerWelfare;