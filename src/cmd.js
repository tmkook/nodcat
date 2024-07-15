const { sutando } = require('sutando');
module.exports = function (config, logger) {
    //connection
    const database = config('database');
    for (let name in database) {
        sutando.addConnection(database[name], name);
    }

    //commands
    const argv = process.argv;
    let cmd = (argv[2] ?? 'serve:run').split(':');
    let params = argv.slice(3);
    let file = cmd[0] ?? 'serve';
    let method = cmd[1] ?? 'run';
    try {
        let obj = require('../command/' + file);
        obj[method](params);
    } catch (e) {
        logger.error(e);
    }
}