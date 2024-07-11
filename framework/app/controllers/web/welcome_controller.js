const { controller } = require('nodcat');
module.exports = class welcome_controller extends controller {
    index(req, res) {
        let clientIP = req.ip;
        let userAgent = req.headers['user-agent'];
        res.render('welcome.html', { userAgent: userAgent, clientIP: clientIP });
    }
}