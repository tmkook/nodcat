let conf = null;
const fs = require("fs");

/**
 * 获取配置
 * @param {string} key 
 * @param {*} def 
 * @returns 
 */
module.exports = function (key, def) {
    if (!conf) {
        // parse env
        let envfile = process.cwd() + '/.env';
        let confile = process.cwd() + '/config/';
        if (fs.existsSync(envfile) && fs.existsSync(confile)) {
            let str = fs.readFileSync(envfile, 'utf-8');
            if (str.length < 128) {
                return this.log('not found .env file. please run server:env');
            }
            let lines = str.indexOf("\n") > -1 ? str.split("\n") : str.split("\r");
            for (let i = 0; i < lines.length; i++) {
                let item = lines[i].trim();
                if (item != '' && item.indexOf('=') > 0) {
                    let kv = item.split('=');
                    process.env[kv[0].trim()] = kv[1].trim();
                }
            }

            //load config
            let result = {};
            let dirs = fs.readdirSync(confile);
            for (let i in dirs) {
                let file = confile + dirs[i];
                if (file.substring(file.length - 3) == '.js') {
                    let obj = require(file);
                    if (obj) {
                        let key = dirs[i].replace('.js', '');
                        result[key] = obj;
                    }
                }
            }
            conf = result;
        }
    }
    let data = Object.assign(conf ?? {}, {});
    let keys = key.split('.');
    for (let i in keys) {
        data = data[keys[i]];
    }
    return data === undefined ? def : data;
}