const controller = require('../../src/controller');
const fs = require('fs');

module.exports = class admin_logs_controller extends controller {
    crud(req, res) {
        this.success({
            "type": "page",
            "body": "dev"
        });
    }

    form(req, res) {

    }
}