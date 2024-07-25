const fs = require('fs');
const path = require('path');
const secret = require('../src/secret');
const logger = require('../src/logger');
const router = require('../src/router');
const config = require('../src/config');

module.exports = new class serve {

    install(params) {
        this.bat = true;
        let to = process.cwd();
        let dir = path.join(__dirname, '../framework/');
        let files = fs.readdirSync(dir);
        for (let i in files) {
            fs.cpSync(dir + files[i], to + '/' + files[i], { recursive: true });
            logger.success(files[i] + ' has been created');
        }
        this.public(params);
        this.env(params);
        process.exit(0);
    }

    public(params) {
        try {
            fs.symlinkSync(path.join(__dirname, '../admin/storage/sdk'), process.cwd() + '/public/sdk', 'dir');
            logger.success('sdk has been created');
            fs.symlinkSync(process.cwd() + '/storage/uploads', process.cwd() + '/public/uploads', 'dir');
            logger.success('uploads has been created');
        } catch (e) {
            logger.info(e.toString());
        }
        if (!this.bat) {
            process.exit(0);
        }
    }

    list(params) {
        let files = fs.readdirSync(__dirname);
        for (let i in files) {
            if (files[i].indexOf('.js') > 0) {
                let file = files[i].replace('.js', '');
                let obj = require('./' + file);
                let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
                for (let i in methods) {
                    if (methods[i] != 'constructor') {
                        logger.success(file + ':' + methods[i]);
                    }
                }
            }
        }
        if (!this.bat) {
            process.exit(0);
        }
    }

    env(params) {
        let data = [
            'APP_KEY=' + secret.snow(64),
            'APP_ENV=dev',
            'APP_PORT=3000',
            'APP_NAME=nodcat',
            'APP_DEBUG=true',
            '',
            'LOG=stack',
            'LOG_LEVEL=error',
            'HOST=localhost',
            'PROTOCOL=http',
            'ASSET_URL=/',
            'TZ=Asia/Shanghai',
            '',
            'DB_CLIENT=mysql2',
            'DB_HOST=127.0.0.1',
            'DB_PORT=3306',
            'DB_USER=root',
            'DB_PASSWORD=',
            'DB_DATABASE=test',
        ];
        fs.writeFileSync(process.cwd() + '/.env', data.join("\r\n"));
        logger.success('.env file has been created');
        if (!this.bat) {
            process.exit(0);
        }
    }

    key(params) {
        let data = fs.readFileSync(process.cwd() + '/.env');
        if (!data || data == '') {
            throw Error('.env file invalid');
        }
        let key = secret.snow(64);
        let lines = data.indexOf("\r") ? data.split("\r") : data.split("\n");
        for (let i in lines) {
            if (lines[i].indexOf('APP_KEY') > -1) {
                lines[i] = 'APP_KEY=' + key;
            } else {
                lines[i] = lines[i].trim();
            }
        }
        fs.writeFileSync(process.cwd() + '/.env', data.join("\r\n"));
        logger.success('.env APP_KEY has benn changed');
        if (!this.bat) {
            process.exit(0);
        }
    }

    run(params) {
        //routes
        require('../admin/routes');
        require(process.cwd() + '/app/use');
        require(process.cwd() + '/app/api');
        require(process.cwd() + '/app/web');

        //listen
        const host = config('app.host');
        const port = config('app.port');
        const protocol = config('app.protocol');
        router.listen(port, () => {
            logger.success('server: ' + protocol + '://' + host + ':' + port);
        });
    }
}