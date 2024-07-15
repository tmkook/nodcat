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
        return (req, res) => {
            let classname = require(process.cwd() + '/app/controllers/' + file);
            let controller = new classname(req, res);
            if (controller[action]) {
                controller[action](req, res);
            } else {
                res.status(404).send('404 not found');
            }
        }
    }

    /**
     * express app
     */
    return router;
})();