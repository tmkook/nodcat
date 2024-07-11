"use strict";
const secret = require('./secret');
module.exports = class auth {
    req = null;
    res = null;
    user = null;
    options = {
        key: process.env.APP_KEY,
        prefix: "admin",
        cookie_name: "admin_auth_token",
        ignore_path: ["/admin/login"],
        permissions: {
            admin: [
                {
                    "path": "/admin.*",
                    "methods": "GET,POST,DELETE",
                }
            ]
        }
    };

    constructor(req, res, options) {
        this.req = req;
        this.res = res;
        this.options = Object.assign(this.options, options ?? {});
        this.user = secret.decrypt(this.req.cookies[this.options.cookie_name], this.options.key);
        if (this.user) {
            this.login(this.user.data, this.user.exp);
        }
    }

    logout() {
        this.res.cookie(this.options.cookie_name, '', { maxAge: 0 });
    }

    login(user, exp) {
        if (!user.id || !user.roles) {
            throw Error('user invalid');
        }
        if (!exp) exp = 3600;
        let encrypt = secret.encrypt(user, exp, this.options.key);
        this.user = secret.decrypt(encrypt, this.options.key);
        if (this.user) {
            this.res.cookie(this.options.cookie_name, encrypt, { maxAge: exp * 1000 });
        }
    }

    isRole(role) {
        if (this.user) {
            let data = this.user.data.roles ?? '';
            let roles = data.split(',');
            let is = role.split(',')
            for (let i in roles) {
                for (let o in is) {
                    if (roles[i] == is[o]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    can(url, method) {
        if (!url) {
            url = (this.req.baseUrl || this.req.path);
        }
        if (!method) {
            method = this.req.method;
        }
        url = url.toLowerCase();
        method = method.toLowerCase();

        //不包含前缀
        if (!url.match(new RegExp('^/' + this.options.prefix + '.*', 'i'))) {
            return true;
        }

        //是否是忽略的
        for (let i in this.options.ignore_path) {
            if (url.match(new RegExp('^' + this.options.ignore_path[i] + '$', 'i'))) {
                return true;
            }
        }

        //是否有权限
        for (let role in this.options.permissions) {
            if (this.isRole(role)) {
                let items = this.options.permissions[role];
                for (let i in items) {
                    let item = items[i];
                    if (url.match(new RegExp('^' + item.path + '$', 'i'))) {
                        if (item.methods.match(new RegExp(method, 'i'))) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
}