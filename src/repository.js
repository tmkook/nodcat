const secret = require('./secret');
const parseid = (dec) => dec ? dec.data : null;
/**
 * 后台数据仓库基类
 * 提供简单的 CRUD 接口
 */
module.exports = class repository {
    model = null;
    safeid_exp = 0;
    safeid_key = null;

    /**
     * 列表
     * @param {json} query 查询参数
     * @param {array} hidden 隐藏字段
     * @param {json} relationHidden 关联模型隐藏字段
     * @returns 
     */
    async list(query, hidden = [], relationHidden) {
        if (query.id) {
            let id = this.safeid_key ? secret.encrypt(query.id, this.safeid_exp, this.safeid_key) : parseInt(query.id);
            this.model.where('id', id);
        }
        let data = await this.model.paginate(query.page || 1, query.perpage || 20);
        if (hidden.length) {
            data.items().makeHidden(hidden);
        }
        if (relationHidden && Object.keys(relationHidden).length) {
            let items = data.items().items;
            for (let i in relationHidden) {
                for (let o in items) {
                    items[o][i].makeHidden(relationHidden[i]);
                }
            }
        }
        data = data.toData();
        if (this.safeid_key) {
            for (let i in data.data) {
                if (data.data[i].id) {
                    data.data[i].id = secret.encrypt(data.data[i].id, this.safeid_exp, this.safeid_key);
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
        let decid = this.safeid_key ? parseid(secret.decrypt(id, this.safeid_key)) : parseInt(id);
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
        await item.save();
        return Promise.resolve(item.toData());
    }

    /**
     * 更新
     * @param {json} post 
     * @returns 
     */
    async update(post) {
        post.id = this.safeid_key ? parseid(secret.decrypt(post.id, this.safeid_key)) : parseInt(post.id);
        let item = await this.model.findOrFail(post.id);
        for (let i in post) {
            item[i] = post[i];
        }
        await item.save();
        return Promise.resolve(post);
    }

    /**
     * 新增或修改
     * @param {json} post 
     */
    async form(post) {
        return post.id ? this.update(post) : this.store(post);
    }

    /**
     * 删除
     * @param {string} id 
     * @returns 
     */
    async delete(id) {
        let ids = id.split(',');
        for (let i in ids) {
            if (this.safeid_key) {
                ids[i] = parseid(secret.decrypt(ids[i], this.safeid_key));
            } else {
                ids[i] = parseInt(ids[i]);
            }
        }
        await this.model.destroy(ids);
        return Promise.resolve(ids);
    }
}