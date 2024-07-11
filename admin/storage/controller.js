const { controller } = require('nodcat');
const repository = require('../repositories/__filename___repository');

module.exports = class __filename___controller extends controller {

    //后台界面
    crud(req, res) {
        //表格
        let amis = this.amis();
        amis.show([
            {
                "name": "id",
                "label": "ID",
                "sortable": true
            },
            {
                "type": "datetime",
                "name": "created_at",
                "label": "创建",
            }
        ]);

        //详情
        amis.detail([
            {
                "type": "static",
                "name": "id",
                "label": "ID"
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

        //新增
        amis.createAndUpdate([
            {
                "type": "input-text",
                "name": "id",
                "label": "ID",
                "required": true
            }
        ]);

        //搜索
        amis.filter([
            {
                "type": "input-text",
                "name": "id",
                "label": "ID",
                "required": true
            }
        ]);
    }

    // 表格
    async grid(req, res) {
        let list = await repository.instance().list(req.query);
        this.success(list);
    }

    // 详情
    async detail(req, res) {
        let data = await repository.instance().show(req.params);
        this.success(data);
    }

    // 删除
    async delete(req, res) {
        let ids = await repository.instance().delete(req.query);
        this.success(ids);
    }

    //表单
    async form(req, res) {
        if (req.body.id) {
            this.success(await repository.instance().update(req.body));
        } else {
            this.success(await repository.instance().store(req.body));
        }
    }
}
