/**
 * 注册服务 - 中间件和定时器
 * router = express()
 *
 * docs examples:
 * https://www.expressjs.com.cn/5x/api.html#app
 *
 */

// 中间件
const { router, config } = require('nodcat');
const throttle = require('../app/middlewares/throttle');
router.use('/api/*', throttle.handle);

//定时器
if (config('app.env') == 'dev') {
    //只在 dev 开发模式下启用
    const hotreload = require('../app/schedules/hotreload');
    setInterval(hotreload.handle, 2000);
}