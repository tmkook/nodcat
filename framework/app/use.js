/**
 * 注册服务 - 中间件和定时器
 * router = express()
 *
 * docs examples:
 * https://www.expressjs.com.cn/5x/api.html#app
 *
 */
const { router } = require('nodcat');

// 错误异常处理
router.use(require('../app/middlewares/exceptions').handle);

// 限流阀
router.use('/api/*', require('../app/middlewares/throttle').handle);