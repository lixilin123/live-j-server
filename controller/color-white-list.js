/**
 * 文件描述：彩色弹幕白名单增减的中间件 
 */
const jwt = require('jwt-simple');
const query = require('../mysql/mysql.js');
const errorGenerator = require('../lib/error.js');

const whiteListOperate = async ctx => {
    console.log('操作彩色弹幕白名单......')
    console.log(ctx.request.body);

    let resBody = {};
    const param = ctx.request.body
    // 1.解析出uid
    try {
        console.log(111)
        const { uid } = jwt.decode(param.token, 'bilibilitokensecretkey');
        // 2.操作数据库
        if (param.type == 'update') {
            console.log(333)
            const sql1 = `UPDATE user SET color_white_list = '${param.list}' WHERE id = '${uid}' `;
            await query(sql1);
            resBody = { code: 0, data: '白名单更新成功' };
            console.log(444)
        } else if (param.type == 'get') {
            console.log(555)
            const sql2 = `SELECT color_white_list FROM user WHERE id = '${uid}'`;
            const res = await query(sql2);
            resBody = { code: 0, data: res[0]['color_white_list']};
            console.log(666)
        }
    } catch (e) {
        console.log(222)
        resBody = errorGenerator(4000);
    }

    console.log(resBody)
    ctx.response.type = 'json';
    ctx.response.body = resBody;
}

module.exports = whiteListOperate;