const crud = require('../../src/crud');
const config = require('../../src/config');
const controller = require('../../src/controller');
const repository = require('../repositories/admin_repository');
module.exports = class admin_user_controller extends controller {
    schema(req, res) {
        let amis = new crud(req);
        let roles = amis.makeOptions(Object.keys(config('permission.permissions')));
        amis.show([
            {
                "name": "username",
                "label": "账号",
            },
            {
                "name": "nickname",
                "label": "昵称",
            },
            {
                "name": "roles",
                "label": "角色",
            },
            {
                "name": "risked",
                "label": "风控",
            },
            {
                "type": "status",
                "name": "status",
                "label": "状态",
            },
            {
                "type": "datetime",
                "name": "created_at",
                "label": "创建",
            },
            {
                "type": "datetime",
                "name": "created_at",
                "label": "更新",
            },
        ]);

        //详情
        amis.detail([
            {
                "type": "static",
                "name": "username",
                "label": "账号"
            },
            {
                "type": "static",
                "name": "nickname",
                "label": "昵称"
            },
            {
                "type": "static",
                "name": "roles",
                "label": "角色"
            },
            {
                "type": "static",
                "name": "risked",
                "label": "风控"
            },
            {
                "type": "static",
                "name": "status",
                "label": "状态"
            },
            {
                "type": "static",
                "name": "created_at",
                "label": "创建时间"
            },
            {
                "type": "static",
                "name": "updated_at",
                "label": "更新时间"
            },
        ]);

        //新增和修改
        amis.createAndUpdate([
            {
                "type": "input-text",
                "name": "id",
                "label": "ID",
                "required": true,
                "visible": false
            },
            {
                "type": "input-text",
                "name": "nickname",
                "label": "昵称",
                "required": true
            },
            {
                "type": "input-text",
                "name": "username",
                "label": "账号",
                "required": true
            },
            {
                "type": "input-password",
                "name": "password",
                "label": "密码",
            },
            {
                "type": "select",
                "name": "roles",
                "label": "角色",
                "multiple": true,
                "searchable": true,
                "options": roles
            },
            {
                "name": "status",
                "type": "switch",
                "label": "状态",
                "trueValue": 1,
                "falseValue": 0,
                "onText": "启用",
                "offText": "禁用",
                "value": true
            }
        ]);

        //搜索查询
        amis.filter([
            {
                "type": "input-text",
                "name": "id",
                "label": "ID",
                "clearable": true,
                "placeholder": "ID",
                "size": "sm"
            },
            {
                "type": "input-text",
                "name": "username",
                "label": "账号",
                "clearable": true,
                "size": "sm"
            },
            {
                "type": "select",
                "name": "status",
                "label": "状态",
                "options": ["关闭", "正常"]
            }

        ]);
        res.success(amis.render());
    }

    grid(req, res) {
        let repo = new repository;
        repo.list(req.query, ['password']).then(data => {
            res.success(data);
        }).catch(e => {
            res.error(e);
        });
    }

    detail(req, res) {
        let repo = new repository;
        repo.show(req.params.id).then(data => {
            res.success(data);
        }).catch(e => {
            res.error(e);
        });
    }

    delete(req, res) {
        let repo = new repository;
        repo.delete(req.query.id).then(data => {
            res.success(data);
        }).catch(e => {
            res.error(e);
        });
    }

    form(req, res) {
        let repo = new repository;
        if (req.body.password.length > 5) {
            req.body.password = secret.crypto.MD5(req.body.password).toString();
        }
        repo.form(req.body).then(data => {
            res.success(data);
        }).catch(e => {
            res.error(e);
        });
    }
}