const fs = require('fs');
const path = require('path');
const logger = require('../src/logger');
module.exports = new class make {

    model(params) {
        if (!params[0] || params[0].indexOf('-') > -1) {
            return logger.error('model name invalid');
        }
        let file = params[0].toLowerCase();
        let tpl = fs.readFileSync(path.join(__dirname, '../admin/storage/model.js'), 'utf-8').replaceAll('__filename__', file);
        fs.writeFileSync(process.cwd() + '/app/models/' + file + '.js', tpl);
        logger.success(file + ' model has been created');
        if (this.isCrud != true) {
            process.exit(0);
        }
    }

    migrate(params) {
        if (!params[0] || params[0].indexOf('-') > -1) {
            return logger.error('migrate name invalid');
        }
        let file = params[0].toLowerCase();
        let tpl = fs.readFileSync(path.join(__dirname, '../admin/storage/migrate.js'), 'utf-8').replaceAll('__filename__', file);
        let time = parseInt(Date.now() / 1000);
        fs.writeFileSync(process.cwd() + '/app/migrations/' + time + '_table_' + file + '.js', tpl);
        logger.success(file + ' migrate has been created');
        if (this.isCrud != true) {
            process.exit(0);
        }
    }

    repository(params) {
        if (!params[0] || params[0].indexOf('-') > -1) {
            return logger.success('repository name invalid');
        }
        let file = params[0].toLowerCase();
        let tpl = fs.readFileSync(path.join(__dirname, '../admin/storage/repository.js'), 'utf-8').replaceAll('__filename__', file);
        fs.writeFileSync(process.cwd() + '/app/repositories/' + file + '_repository.js', tpl);
        logger.success(file + ' repository has been created');
        if (this.isCrud != true) {
            process.exit(0);
        }
    }

    controller(params) {
        if (!params[0] || params[0].indexOf('-') > -1) {
            return logger.success('controller name invalid');
        }
        let file = params[0].toLowerCase();
        let dir = (params[1] ?? 'admin').toLowerCase();
        let tpl = fs.readFileSync(path.join(__dirname, '../admin/storage/' + dir + '_controller.js'), 'utf-8').replaceAll('__filename__', file);
        fs.writeFileSync(process.cwd() + '/app/controllers/' + dir + '/' + file + '_controller.js', tpl);
        logger.success(file + ' controller has been created');
        if (this.isCrud != true) {
            process.exit(0);
        }
    }

    crud(params) {
        this.isCrud = true;
        this.model(params);
        this.migrate(params);
        this.repository(params);
        this.controller(params);
        process.exit(0);
    }
}