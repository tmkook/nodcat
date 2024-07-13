const secret = require('./secret');
const config = require('./config');

/**
 * 后台数据仓库基类
 * 提供简单的 CRUD 接口
 */
module.exports = class repository {
    model = null;
    safeid_exp = 86400;
    key = config('permission.key');

    /**
     * 列表
     * @param {json} params 查询参数
     * @param {array} hidden 隐藏字段
     * @returns 
     */
    async list(params, hidden = []) {
        if (params.id) {
            let id = this.safeid_exp ? secret.encrypt(params.id, this.safeid_exp, this.key) : parseInt(params.id);
            this.model.where('id', id);
        }
        let data = await this.model.paginate(params.page || 1, params.perpage || 20);
        if (hidden.length) {
            data.items().makeHidden(hidden);
        }
        data = data.toData();
        if (this.safeid_exp) {

            for (let i in data.data) {
                if (data.data[i].id) {
                    data.data[i].id = secret.encrypt(data.data[i].id, this.safeid_exp, this.key);
                }
            }
        }
        let result = {
            "items": data.data,
            "total": data.total,
            "count": data.count,
            "page": data.current_page,
            "perPage": data.per_page,
            "lastPage": data.last_page,
        }
        return Promise.resolve(result);
    }

    /**
     * 详情
     * @param {string} safeid 列表id
     * @param {array} hidden 隐藏字段
     * @returns 
     */
    async show(safeid, hidden = []) {
        let id = this.safeid_exp ? secret.decrypt(safeid, this.key).data : parseInt(safeid);
        let data = await this.model.where('id', id).firstOrFail();
        if (data && hidden.length) {
            data.makeHidden(hidden);
        }
        data = data.toData();
        data.id = safeid;
        return Promise.resolve(data);
    }

    /**
     * 新增
     * @param {json} params 
     * @returns 
     */
    async store(params) {
        let item = new this.model;
        for (let i in params) {
            item[i] = params[i];
        }
        await item.save();
        return Promise.resolve(params);
    }

    /**
     * 更新
     * @param {json} params 
     * @returns 
     */
    async update(params) {
        params.id = this.safeid_exp ? secret.decrypt(params.id, this.key).data : parseInt(params.id);
        let item = await this.model.findOrFail(params.id);
        for (let i in params) {
            item[i] = params[i];
        }
        await item.save();
        return Promise.resolve(params);
    }

    /**
     * 删除
     * @param {string} id 
     * @returns 
     */
    async delete(id) {
        let ids = id.split(',');
        for (let i in ids) {
            if (this.safeid_exp) {
                ids[i] = secret.decrypt(ids[i], this.key).data;
            } else {
                ids[i] = parseInt(ids[i]);
            }
        }
        await this.model.destroy(ids);
        return Promise.resolve(ids);
    }
}
