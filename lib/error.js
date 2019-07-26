/**
 * 该文件生成错误码，用来回应客户端的请求
 */
const errorCodeAndMsg = {
    '4000': '登陆态无效！',

    '4001': '邮箱已被注册！',
    '4002': '邮箱不存在！',
    '4003': '密码错误，请重试！',
    '4004': '登录状态已失效！请重新登录^_^',
    '4005': '登录状态被篡改，请重新登录！',

    '4101': '您输入的邮箱不存在',

    '4201': '链接已过期',
    '4202': '错误的链接',

    '4301': '已领取过体验会员'
}
const errorGenerator = key => {
    return {
        code: key,
        msg: errorCodeAndMsg[key]
    }
}

module.exports = errorGenerator;