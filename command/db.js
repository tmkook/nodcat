const fs = require('fs');
const path = require('path');
const logger = require('../src/logger');

function getMigrations() {
    const requireDir = (dir) => {
        let result = {};
        let dirs = fs.readdirSync(dir);
        for (let i in dirs) {
            let file = dir + '/' + dirs[i];
            if (file.substring(file.length - 3) == '.js') {
                let obj = require(file);
                if (obj) {
                    let key = dirs[i].replace('.js', '');
                    result[key] = obj;
                }
            }
        }
        return result;
    }
    let dir1 = path.join(__dirname, '../admin/migrations');
    let dir2 = process.cwd() + '/app/migrations';
    return Object.assign(requireDir(dir1), requireDir(dir2));
}

module.exports = new class database {
    async up(params) {
        let migrations = getMigrations();
        for (let i in migrations) {
            logger.success(i);
            await migrations[i].up();
        }
        process.exit();
    }

    async fake(params) {
        let migrations = getMigrations();
        for (let i in migrations) {
            logger.success(i);
            await migrations[i].fake();
        }
        process.exit();
    }

    async seed(params) {
        let migrations = getMigrations();
        for (let i in migrations) {
            logger.success(i);
            await migrations[i].seed();
        }
        process.exit();
    }

    async down(params) {
        let migrations = getMigrations();
        for (let i in migrations) {
            logger.success(i);
            await migrations[i].down();
        }
        process.exit();
    }
}