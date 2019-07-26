const Koa = require('koa');
const app = new Koa();

// 静态资源访问
const serve = require('koa-static');
app.use(serve('static'));

// 初始化websocket服务
const createWebSocketServer = require('./websocket/websocket.js');
createWebSocketServer();

// 加载：处理跨域请求的预检请求
const cors = require('@koa/cors');
app.use(cors({ 'credentials': true }));

// 加载：body解析
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// 加载：捕获全局错误，并给出响应
const catchError = require('./controller/catch-error.js');
app.use(catchError);

// 加载：路由
app.use(require('./router/router.js').routes());

// 监听端口
const { debug } = require('./lib/config.js');
app.listen(debug ? 3001 : 8321, () => {
    console.log(`server is running at port ${debug ? 3001 : 8321}...`)
});

// 监听错误，打印日志
const { errorLog } = require('./controller/log.js');
app.on('error', errorLog);