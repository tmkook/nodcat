/**
 * 热更新，使更新代码无需重启服务
 * 只在 dev 模式下启用
 */
const { config } = require('nodcat');
if (config('app.env') == 'dev' && config('app.debug')) {
    setInterval(() => {
        for (let path in require.cache) {
            if (path.indexOf('node_modules') < 0) {
                delete require.cache[path];
            }
        }
    }, 1000);
}