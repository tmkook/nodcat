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
    grid(req, res) {
        let repo = new repository;
        repo.list(req.query).then(list => {
            res.success(list);
        }).catch(e => {
            res.error(e.toString());
        })
    }

    /**
     * 详情接口
     * @param {*} req 
     * @param {*} res 
     */
    detail(req, res) {
        let repo = new repository;
        repo.show(req.params).then(data => {
            res.success(data);
        }).catch(e => {
            res.error(e.toString());
        });
    }

    /**
     * 删除接口
     * @param {*} req 
     * @param {*} res 
     */
    delete(req, res) {
        let repo = new repository;
        repo.delete(req.query.id).then(data => {
            res.success(data);
        }).catch(e => {
            res.error(e.toString());
        });
    }

    //表单
    form(req, res) {
        let repo = new repository;
        let promis = req.body.id ? repo.update(req.body) : repo.store(req.body);
        promis.then(data => {
            res.success(data);
        }).catch(e => {
            res.error(e.toString());
        });
    }
}
