/**
 * 文件描述：检测token令牌是否有效的中间件 
 */

const jwt = require('jwt-simple');
const errorGenerator = require('../lib/error.js');
// 注册服务
const checkToken = async ctx => {
    console.log('chenckToken中......')
    console.log(ctx.request.body);
    const { token } = ctx.request.body;
    let resBody = {};
    try {
        const { uid, expire } = jwt.decode(token, 'bilibilitokensecretkey');
        if(new Date() >= new Date(+expire)) {
            resBody = errorGenerator(4004);
        } else {
            resBody = {
                code: 0,
                data: ''
            };
        }
    } catch(e) {
        resBody = errorGenerator(4005);
    }
    ctx.response.type = 'json';
    ctx.response.body = resBody;
}

module.exports = checkToken;