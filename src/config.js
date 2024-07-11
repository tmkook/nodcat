let conf = null;
const fs = require("fs");
module.exports = function (key) {
    if (!conf) {
        // parse env
        let str = fs.readFileSync(process.cwd() + '/.env', 'utf-8');
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
        let path = process.cwd() + '/config/';
        let dirs = fs.readdirSync(path);
        for (let i in dirs) {
            let file = path + dirs[i];
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
    let data = Object.assign(conf, {});
    let keys = key.split('.');
    for (let i in keys) {
        data = data[keys[i]];
    }
    return data;
}