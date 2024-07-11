/**
 * 节流阀 - 限制接口请求频率
 * router = express();
 *
 * docs examples:
 * https://www.expressjs.com.cn/5x/api.html#app
 *
 */
let counter = {};
const { router } = require('nodcat');

router.use('/api/*', (req, res, next) => {
    let now = parseInt((new Date()).getTime() / 1000);

    //清理过期
    for (let i in counter) {
        if (now - counter[i].time > 60) {
            delete counter[i];
        }
    }

    //节流每分钟60次
    let item = counter[req.ip] ? counter[req.ip] : { num: 0, time: now };
    if (item.num < 60) {
        item.num += 1;
        item.time = now;
        counter[req.ip] = item;
        next();
    } else {
        res.status(400).send('access to overclocking');
    }
});