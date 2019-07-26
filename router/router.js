const Router = require('koa-router');
const router = new Router();

// 引入controller
const main = require('../controller/main.js');
const signUp = require('../controller/sign-up.js');
const signIn = require('../controller/sign-in.js');
const checkToken = require('../controller/check-token.js');
const { createResetPasswordUrl, checkResetPasswordUrl, resetPassword } = require('../controller/reset-password.js')
const init = require('../controller/init.js');
const whiteListOperate = require('../controller/color-white-list.js');
const vipConfig = require('../controller/vip-config.js');
const newerWelfare = require('../controller/newer-welfare.js');
const updateContent = require('../controller/update-content.js');

// 路由
router.get('/', main);
router.post('/account/signUp', signUp);
router.post('/account/signIn', signIn);
router.post('/account/checkToken', checkToken);
router.post('/account/createResetPasswordUrl', createResetPasswordUrl);
router.get('/account/checkResetPasswordUrl', checkResetPasswordUrl);
router.get('/account/resetPassword', resetPassword);
router.post('/home/init', init);
router.post('/home/whiteListOperate', whiteListOperate);
router.post('/home/vipConfig', vipConfig);
router.post('/home/getNewerWelfare', newerWelfare);
router.post('/update/content', updateContent);

module.exports = router