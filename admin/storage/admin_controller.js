const { controller } = require('nodcat');
const repository = require('../../repositories/__filename___repository');

module.exports = class __filename___controller extends controller {

    /**
     * this.crud 是一个简单的 CRUD JSON 封装返回 amis schemaApi 文档如下
     * https://aisuda.bce.baidu.com/amis/zh-CN/components/app
     * 
     * @param {*} req 
     * @param {*} res 
     * 
     */
    schema(req, res) {
        let crud = this.getCrudSchema();

        /**
         * 表格显示字段
         * https://aisuda.bce.baidu.com/amis/zh-CN/components/crud
         */
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

        /**
         * 详情显示字段
         * https://aisuda.bce.baidu.com/amis/zh-CN/components/crud
         */
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

        /**
         * 新增和修改字段
         * 也可以分开 create 和 update 单独定义
         * https://aisuda.bce.baidu.com/amis/zh-CN/components/form/index
         */
        crud.createAndUpdate([
            {
                "type": "input-text",
                "name": "id",
                "label": "ID",
                "required": true
            }
        ]);

        /**
         * 搜索字段
         * https://aisuda.bce.baidu.com/amis/zh-CN/components/form/index
         */
        crud.filter([
            {
                "type": "input-text",
                "name": "id",
                "label": "ID",
                "required": true
            }
        ]);

        /**
         * 返回 crud json
         * console.log(crud.render());
         * https://aisuda.bce.baidu.com/amis/zh-CN/components/crud
         */
        this.success(crud.render());
    }

    /**
     * 表格接口
     * @param {*} req 
     * @param {*} res 
     */
    async grid(req, res) {
        let repo = repository.instance();
        let list = await repo.list(req.query);
        this.success(list);
    }

    /**
     * 详情接口
     * @param {*} req 
     * @param {*} res 
     */
    async detail(req, res) {
        let repo = repository.instance();
        let data = await repo.show(req.params);
        this.success(data);
    }

    /**
     * 删除接口
     * @param {*} req 
     * @param {*} res 
     */
    async delete(req, res) {
        let repo = repository.instance();
        let ids = await repo.delete(req.query.id);
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
