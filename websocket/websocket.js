const jwt = require('jwt-simple');
const query = require('../mysql/mysql.js');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8005 });
const { Room } = require('./bilibili-live/index.js');
const updateVipStatus = require('../controller/update-vip-status.js');

const wsMapRoom = new Map();

const createWebSocketServer = () => {
    // websocket心跳机制
    const interval = setInterval(() => {
        for (let ws of wsMapRoom.keys()) {
            if (ws.isAlive === false) {
                ws.terminate();
                return;
            }
            ws.isAlive = false;
            ws.ping();
        }
    }, 5000);

    wss.on('connection', (ws) => {
        console.log('客户端——服务端：WS连接已连接')
        ws.isAlive = true;
        ws.on('pong', () => {
            console.log('收到pong')
            ws.isAlive = true;
        })

        ws.on('message', async (message) => {
            const parseMsg = JSON.parse(message);
            console.log(parseMsg)
            // 统一解析uid
            let uid;
            if (parseMsg.type == 'open' || parseMsg.type == 'updateVipStatus') {
                try {
                    uid = jwt.decode(parseMsg.token, 'bilibilitokensecretkey').uid;
                } catch (e) {
                    throw e;
                }
            }
            // 回应ws
            if (parseMsg.type == 'open') {
                // 尝试打开房间弹幕连接
                let sql1 = `SELECT room_id FROM user WHERE id = '${uid}'`;
                const res = await query(sql1);
                if (res[0]) {
                    console.log(`查看到的房间号是：${JSON.stringify(res)}`)
                    connectRoom(res[0].room_id, ws);
                } else {
                    throw new Error('无法根据提供的token查询到房间号！');
                }
            } else if(parseMsg.type == 'updateVipStatus') {
                updateVipStatus(ws, uid)
            }
        });
        ws.on('close', () => {
            disconnectRoom(ws);
            console.log('客户端——服务端：WS连接已关闭');
        });
    })
}

const connectRoom = (roomId, ws) => {
    new Room({
        url: roomId
    }).connect().then(room => {
        room
            .on('danmaku.connect', () => {
                console.log('正在连接至弹幕服务器')
                ws.send(JSON.stringify({ type: 'danmaku.connect' }));
            })
            .on('danmaku.connected', () => {
                console.log('成功连接至弹幕服务器')
                ws.send(JSON.stringify({ type: 'danmaku.connected' }));
            })
            .on('danmaku.message', (message) => {
                console.log(message)
                ws.send(JSON.stringify({
                    type: 'danmaku.message',
                    data: message
                }));
            })
            .on('danmaku.close', () => {
                console.log('已断开与弹幕服务器的连接')
                ws.send(JSON.stringify({ type: 'danmaku.close' }));
            })
            .on('danmaku.error', () => {
                console.log('与弹幕服务器的连接出现错误')
                ws.send(JSON.stringify({ type: 'danmaku.error' }));
                ws.terminate();
                disconnectRoom(ws);
            })
            .on('newFans', (fans) => {
                console.log('有新的粉丝')
                console.log(fans)
                ws.send(JSON.stringify({
                    type: 'newFans',
                    data: fans
                }));
            })
            .on('info', (info) => {
                console.log('直播间信息')
                console.log(info)
                ws.send(JSON.stringify({
                    type: 'info',
                    data: info
                }));
            })
        wsMapRoom.set(ws, room)
    })
}

const disconnectRoom = (ws) => {
    wsMapRoom.get(ws) && wsMapRoom.get(ws).disconnect();
    wsMapRoom.delete(ws);
}

module.exports = createWebSocketServer;