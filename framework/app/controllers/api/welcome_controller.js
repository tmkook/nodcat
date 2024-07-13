const { controller } = require('nodcat');
module.exports = class welcome_controller extends controller {
    index(req, res) {
        res.success({ "welcome": "hello world" });
    }
}