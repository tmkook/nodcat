"use strict";
const logger = require('./logger');

/**
 * 路由
 * @returns express
 */
module.exports = (function router() {
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const express = require('express');
    const router = express();
    router.use(express.static(process.cwd() + '/public'));
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    router.use(cookieParser());


    /**
     * 加载控制器
     * @param {string} file 
     * @param {string} action 
     * @returns 
     */
    router.controller = function (file, action) {
        return async (req, res) => {
            try {
                let classname = require(process.cwd() + '/app/controllers/' + file);
                let controller = new classname(req, res);
                if (controller[action]) {
                    if (controller.jwt && controller.permission) {
                        controller.permission();
                    }
                    let promis = controller[action](req, res);
                    if (promis && promis.then) {
                        await promis;
                    }
                } else {
                    res.status(404).send('404 not found');
                }
            } catch (e) {
                logger.error(e);
                let debug = process.env.APP_DEBUG ?? 'true';
                let msg = debug == 'true' ? e.toString() : 'server error';
                res.status(500).send(msg);
            }
            return Promise.resolve(true);
        }
    }

    /**
     * express app
     */
    return router;
})();