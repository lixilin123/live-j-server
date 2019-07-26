/**
 * 文件描述：捕获程序运行报错的中间件
 */

const catchError = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        let errCoede = err.statusCode || err.status || 500;
        ctx.response.type = 'json'
        ctx.response.body = {
            code: errCoede,
            msg: `服务器发生错误，错误码为【${errCoede}】`
        };
        ctx.app.emit('error', err, ctx);
    }
};

module.exports = catchError;