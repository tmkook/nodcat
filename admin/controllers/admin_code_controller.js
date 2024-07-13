const controller = require('../../src/controller');
module.exports = class admin_logs_controller extends controller {
    crud(req, res) {
        res.success({
            "type": "form",
            "api": req.admin_uri('/auth/code'),
            "body": [
                {
                    "type": "textarea",
                    "label": "SSH",
                    "name": "cmd",
                    "placeholder": "请输入 SSH 命令"
                },
                {
                    "type": "static",
                    "label": "返回结果",
                    "name": "stdout",
                    "visibleOn": "data.stdout.length > 0",
                }
            ]
        });
    }

    form(req, res) {
        let cmd = req.body.cmd.trim();
        let shell = require('child_process');
        shell.exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
            if (stderr) {
                res.error(stderr.trim());
            } else {
                res.success(true, stdout.trim());
            }
        });
    }
}