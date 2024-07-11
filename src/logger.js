"use strict";
const fs = require("fs");
module.exports = new class logger {
    //write log
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

    //debug log
    show(msg, level) {
        let colors = { error: 31, success: 32, debug: 33, info: 34, test: 36 };
        let color = colors[level] ?? 32;
        console.log('\x1b[' + color + 'm%s\x1b[0m', msg);
        if (process.env.LOG_LEVEL == '' || process.env.LOG_LEVEL == level) {
            this.write(msg, level);
        }
    }

    test(msg) {
        this.show(msg, 'test');
    }

    info(msg) {
        this.show(msg, 'info');
    }

    debug(msg) {
        this.show(msg, 'debug');
    }

    error(msg) {
        this.show(msg, 'error');
    }

    success(msg) {
        this.show(msg, 'success');
    }
}