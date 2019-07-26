/**
 * 文件描述：主进程中间件
 */

const main = async ctx => {
    if(ctx.request.accepts('xml')) {
        ctx.response.type = 'xml';
        ctx.response.body = '<data>Hello World</data>';
    } else if(ctx.request.accepts('json')) {
        ctx.response.type = 'json';
        ctx.response.body = {data: 'Hello World'};
    } else if(ctx.request.accepts('html')) {
        ctx.response.type = 'html';
        ctx.response.body = '<p>Hello World</p>';
    } else {
        ctx.response.type = 'text';
        ctx.response.body = 'Hello World';
    }
}

module.exports = main;

