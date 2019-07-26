const { debug } = require('../lib/config.js');
const mysql = require('mysql');

// 创建mysql连接池
const pool = mysql.createPool({
    connectionLimit: 10,
    host: debug ? 'localhost' : 'yishisi.cn',
    user: 'root',
    password: debug ? '123456' : 'chelun0716',
    database: 'bilibili_test',
    port: 3306,
    connectTimeout: 60000
})

// 执行sql，返回结果
const query = sql => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                throw err;
            } else {
                connection.query(sql, (queryerr, results, fields) => {
                    //释放连接
                    connection.release();
                    if(queryerr) {
                        throw queryerr;
                    } else {
                        resolve(JSON.parse(JSON.stringify(results)));
                    }
                });
            }
        });
    })
};

// 导出
module.exports = query;