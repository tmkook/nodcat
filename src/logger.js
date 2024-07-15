const fs = require("fs");
/**
 * 日志
 */
module.exports = new class logger {
    /**
     * 写入日志
     * @param {string} msg 
     * @param {string} level 
     */
    write(msg, level) {
        if (!level) {
            level = 'info';
        }
        if (msg.stack) {
            msg = msg.stack;
        }
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate() + 1;
        let hours = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        let file = 'stack.log';
        if (process.env.LOG == 'daily') {
            file = year + '-' + month + '-' + day + '.log';
        } else if (process.env.LOG == 'month') {
            file = year + '-' + month + '.log';
        } else if (process.env.LOG == 'year') {
            file = year + '.log';
        }
        fs.appendFileSync(process.cwd() + '/storage/logs/' + file, level + ' [' + year + '/' + month + '/' + day + ' ' + hours + ':' + minute + ':' + second + '] ' + msg + "\r\n");
    }

    /**
     * 显示日志 - 按系统配置写入日志
     * @param {string} msg 
     * @param {string} level 
     */
    show(msg, level) {
        let colors = { error: 31, success: 32, debug: 33, info: 34, test: 36 };
        let color = colors[level] ?? 32;
        console.log('\x1b[' + color + 'm%s\x1b[0m', msg);
        if (process.env.LOG_LEVEL == '' || process.env.LOG_LEVEL == level) {
            this.write(msg, level);
        }
    }

    /**
     * 测试日志
     * @param {string} msg 
     */
    test(msg) {
        this.show(msg, 'test');
    }

    /**
     * 信息
     * @param {string} msg 
     */
    info(msg) {
        this.show(msg, 'info');
    }

    /**
     * 调试
     * @param {string} msg 
     */
    debug(msg) {
        this.show(msg, 'debug');
    }

    /**
     * 错误
     * @param {string} msg 
     */
    error(msg) {
        this.show(msg, 'error');
    }

    /**
     * 成功
     * @param {string} msg 
     */
    success(msg) {
        this.show(msg, 'success');
    }
}