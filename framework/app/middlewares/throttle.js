/**
 * 节流阀 - 限制接口请求频率
 * 在 use.js 文件中启用
 *
 * docs examples:
 * https://www.expressjs.com.cn/5x/api.html#app
 *
 */

module.exports = new class throttle {
    /**
     * 统计数值
     */
    counter = {};

    /**
     * 执行体
     */
    handle(req, res, next) {
        let now = parseInt((new Date()).getTime() / 1000);

        //清理过期
        for (let i in this.counter) {
            if (now - this.counter[i].time > 60) {
                delete this.counter[i];
            }
        }

        //节流每分钟60次
        let item = this.counter[req.ip] ? this.counter[req.ip] : { num: 0, time: now };
        if (item.num < 60) {
            item.num += 1;
            item.time = now;
            this.counter[req.ip] = item;
            next();
        } else {
            res.status(400).send('access to overclocking');
        }
    }
}