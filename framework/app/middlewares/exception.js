/**
 * 全局错误捕获 - 防止程序 crash
 * 在 use.js 文件中启用
 *
 * docs examples:
 * https://www.expressjs.com.cn/5x/api.html#app
 *
 */
const { logger, config } = require('nodcat');
module.exports = new class exception {
    /**
     * 执行体
     */
    handle(req, res, next) {
        function unhandledRejection(err) {
            let msg = 'UnhandledRejection:' + err.toString() + "\n" + (err.stack ?? '');
            if (msg.indexOf('ModelNotFoundError') > 0) {
                res.status(404).send();
            } else {
                res.status(500).send(err.toString());
            }
            console.log(err);
            logger.write(msg);
        }
        function uncaughtException(err) {
            let msg = 'uncaughtException:' + err.message + "\n" + (err.stack ?? '');
            res.status(500).send(err.toString());
            console.log(err);
            logger.write(msg);
        }
        process.on('uncaughtException', uncaughtException)
        process.on('unhandledRejection', unhandledRejection);
        let end = res.end;
        res.end = function (chunk, encoding) {
            res.end = end;
            res.end(chunk, encoding);
            process.removeListener('uncaughtException', uncaughtException);
            process.removeListener('unhandledRejection', unhandledRejection);
        }
        next();
    }
}