const { controller } = require('nodcat');
module.exports = class __filename___controller extends controller {
    index(req, res) {
        this.success({ "hello": "world" });
    }
}
