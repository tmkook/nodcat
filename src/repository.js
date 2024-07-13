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
     * @param {json} query 查询参数
     * @param {array} hidden 隐藏字段
     * @returns 
     */
    async list(query, hidden = []) {
        if (query.id) {
            let id = this.safeid_exp ? secret.encrypt(query.id, this.safeid_exp, this.key) : parseInt(query.id);
            this.model.where('id', id);
        }
        let data = await this.model.paginate(query.page || 1, query.perpage || 20);
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
     * @param {string} id 列表id
     * @param {array} hidden 隐藏字段
     * @returns 
     */
    async show(id, hidden = []) {
        let decid = this.safeid_exp ? secret.decrypt(id, this.key).data : parseInt(id);
        let data = await this.model.where('id', decid).firstOrFail();
        if (data && hidden.length) {
            data.makeHidden(hidden);
        }
        data = data.toData();
        data.id = id;
        return Promise.resolve(data);
    }

    /**
     * 新增
     * @param {json} post 
     * @returns 
     */
    async store(post) {
        let item = this.model.getModel();
        for (let i in post) {
            item[i] = post[i];
        }
        item.save();
        return Promise.resolve(item.toData());
    }

    /**
     * 更新
     * @param {json} post 
     * @returns 
     */
    async update(post) {
        post.id = this.safeid_exp ? secret.decrypt(post.id, this.key).data : parseInt(post.id);
        let item = await this.model.findOrFail(post.id);
        for (let i in post) {
            item[i] = post[i];
        }
        await item.save();
        return Promise.resolve(post);
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
