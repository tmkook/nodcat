const { controller, crud } = require('nodcat');
const repository = require('../../repositories/__filename___repository');

module.exports = class __filename___controller extends controller {
    schema(req, res) {
        /**
         * crud 是一个简单的 amis json 封装，如果你需要个性化可直接返回 amis 配置，文档如下
         * https://aisuda.bce.baidu.com/amis/zh-CN/components/app
         */
        let crud = new crud(req);

        // 列表
        crud.show([
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

        // 详情
        crud.detail([
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

        // 表单
        crud.createAndUpdate([
            {
                "type": "input-text",
                "name": "id",
                "label": "ID",
                "required": true
            }
        ]);

        // 搜索
        crud.filter([
            {
                "type": "input-text",
                "name": "id",
                "label": "ID",
                "required": true
            }
        ]);

        // 返回
        // console.log(crud.render());
        res.success(crud.render());
    }

    /**
     * 表格接口
     * @param {*} req 
     * @param {*} res 
     */
    async grid(req, res) {
        let repo = new repository;
        let list = await repo.list(req.query);
        res.success(list);
    }

    /**
     * 详情接口
     * @param {*} req 
     * @param {*} res 
     */
    async detail(req, res) {
        let repo = new repository;
        let data = await repo.show(req.params);
        res.success(data);
    }

    /**
     * 删除接口
     * @param {*} req 
     * @param {*} res 
     */
    async delete(req, res) {
        let repo = new repository;
        let ids = await repo.delete(req.query.id);
        res.success(ids);
    }

    //表单
    async form(req, res) {
        let repo = new repository;
        if (req.body.id) {
            res.success(await repo.update(req.body));
        } else {
            res.success(await repo.store(req.body));
        }
    }
}
