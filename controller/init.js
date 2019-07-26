/**
 * 文件描述：彩色弹幕白名单增减的中间件 
 */
const jwt = require('jwt-simple');
const query = require('../mysql/mysql.js');
const errorGenerator = require('../lib/error.js');

const init = async ctx => {
    console.log('home页初始化......')
    console.log(ctx.request.body);

    let resBody = {};
    const param = ctx.request.body
    // 1.解析出uid
    try {
        const { uid } = jwt.decode(param.token, 'bilibilitokensecretkey');
        // 2.操作数据库
        const sql1 = `SELECT * FROM user WHERE id = '${uid}'`;
        const res = await query(sql1);
        const data = {
            name: res[0]['name'],
            room_id: res[0]['room_id'],
            color_white_list: res[0]['color_white_list'],
            is_vip: res[0]['is_vip'],
            vip_end_time: res[0]['vip_end_time'],
            newer_welfare: res[0]['newer_welfare']
        }
        resBody = { code: 0, data: data };
    } catch (e) {
        resBody = errorGenerator(4000);
    }

    ctx.response.type = 'json';
    ctx.response.body = resBody;
}

module.exports = init;