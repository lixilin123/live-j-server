/**
 * 文件描述：更新用户会员状态的中间件 
 */
const query = require('../mysql/mysql.js');

const updateVipStatus = async (ws, uid) => {
    console.log('updateVipStatus')
    const sql1 = `SELECT is_vip, vip_end_time, newer_welfare FROM user WHERE id = '${uid}'`;
    const res1 = await query(sql1);
    if (res1[0]) {
        if (res1[0].vip_end_time * 1000 < Date.now()) {
            const sql2 = `UPDATE user SET is_vip = '0' WHERE id = '${uid}' `;
            await query(sql2);
            ws.send(JSON.stringify({
                type: 'updateVipStatus',
                data: {
                    is_vip: 0,
                    vip_end_time: res1[0].vip_end_time, 
                    newer_welfare: res1[0].newer_welfare
                }
            }));
            return;
        }
        ws.send(JSON.stringify({
            type: 'updateVipStatus',
            data: res1[0]
        }));
    } else {
        throw new Error('无法根据提供的token查询到会员状态！');
    }
}

module.exports = updateVipStatus;