/**
 * 热更新 - 使更新代码无需重启服务
 * 在 use.js 文件中启用
 *
 * docs examples:
 * https://www.expressjs.com.cn/5x/api.html#app
 *
 */
const { config } = require('nodcat');
module.exports = new class hotreload {

    /**
     * 定时器间隔时长(毫秒)
     * 0 为不执行
     */
    interval = config('app.debug') ? 5000 : 0;

    /**
     * 执行体
     */
    handle() {
        for (let file in require.cache) {
            if (file.indexOf('node_modules') < 0) {
                delete require.cache[file];
            }
        }
    }
}