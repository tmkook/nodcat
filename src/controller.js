"use strict";

/**
 * 控制器基类
 */
module.exports = class controller {

    /**
     * express request
     */
    req = null;

    /**
     * express response
     */
    res = null;

    /**
     * 
     * @param {object} req 
     * @param {object} res 
     */
    constructor(req, res) {
        /**
         * 
         * @param {*} data 
         * @param {string} msg 
         */
        res.success = function (data, msg) {
            if (!msg) msg = 'success';
            res.status(200).json({ status: 0, msg: msg, data: data || {} });
        }

        /**
         * 
         * @param {string} msg 
         */
        res.error = function (msg) {
            res.status(200).json({ status: 1, msg: msg });
        }

        this.req = req;
        this.res = res;
    }
}