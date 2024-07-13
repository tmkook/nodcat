const { controller } = require('nodcat');
const __filename__ = require('../model/__filename__');
module.exports = class __filename___controller extends controller {
    index(req, res) {
        res.render('welcome.html', { userAgent: req.headers['user-agent'], clientIP: req.ip });
    }
}
