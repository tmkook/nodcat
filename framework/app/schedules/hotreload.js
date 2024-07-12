/**
 * 热更新 - 使更新代码无需重启服务
 * 在 use.js 文件中启用
 *
 * docs examples:
 * https://www.expressjs.com.cn/5x/api.html#app
 *
 */
module.exports = new class hotreload {
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