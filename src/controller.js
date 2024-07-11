"use strict";
module.exports = class controller {
    req = null;
    res = null;

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    success(data, msg) {
        if (!msg) msg = 'success';
        this.res.status(200).json({ status: 0, msg: msg, data: data || {} });
    }

    error(msg) {
        this.res.status(200).json({ status: 1, msg: msg });
    }

    amis() {
        const Amis = require('./amis');
        let amis = new Amis(this.req);
        return amis;
    }
}