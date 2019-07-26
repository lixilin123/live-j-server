/**
 * 文件描述：下发vip支付配置信息的中间件
 */
const query = require('../mysql/mysql.js');
const vipConfig = async ctx => {
    let resBody = {};
    // 判断邮箱是否存在
    let sql1 = `SELECT * FROM vip_config`;
    const res = await query(sql1);

    console.log(res)
    resBody = {
        code: 0,
        data: res
    }

    ctx.response.type = 'json';
    ctx.response.body = resBody;
}

module.exports = vipConfig;