const secret = require('./secret');
const config = require('./config');

module.exports = class repository {
    model = null;
    safeid_exp = 86400;
    key = config('permission.key');

    static instance() {
        return new this;
    }

    //列表
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
        console.log(this.safeid_exp);
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

    //详情
    async show(params, hidden = []) {
        let id = this.safeid_exp ? secret.decrypt(params.id, this.key).data : parseInt(params.id);
        let data = await this.model.where('id', id).firstOrFail();
        if (data && hidden.length) {
            data.makeHidden(hidden);
        }
        data = data.toData();
        data.id = params.id;
        return Promise.resolve(data);
    }

    //新增
    async store(params) {
        let item = new this.model;
        for (let i in params) {
            item[i] = params[i];
        }
        await item.save();
        return Promise.resolve(params);
    }

    //更新
    async update(params) {
        params.id = this.safeid_exp ? secret.decrypt(params.id, this.key).data : parseInt(params.id);
        let item = await this.model.findOrFail(params.id);
        for (let i in params) {
            item[i] = params[i];
        }
        await item.save();
        return Promise.resolve(params);
    }

    //删除
    async delete(params) {
        let ids = params.id.split(',');
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
