const fs = require("fs");
const auth = require('../src/auth');
const config = require('../src/config');
const router = require('../src/router');
const options = config('permission');

const admin_auth_controller = require('./controllers/admin_auth_controller');
const admin_user_controller = require('./controllers/admin_user_controller');
const admin_logs_controller = require('./controllers/admin_logs_controller');
const admin_code_controller = require('./controllers/admin_code_controller');

//简易模板
router.set('views', process.cwd() + '/app/views/');
router.set('view engine', 'html');
router.engine('html', (file, data, callback) => {
    fs.readFile(file, 'utf-8', function (err, html) {
        if (err) {
            return callback(err);
        } else {
            for (let key in data) {
                if (typeof (data[key]) == 'string') {
                    html = html.replaceAll('{$' + key + '}', data[key]);
                }
            }
            return callback(null, html);
        }
    });
});

//后台ACL
const admin_uri = (uri = '', prefix) => '/' + (prefix ?? options.prefix) + uri;
router.all(admin_uri('*'), (req, res, next) => {
    req.admin_uri = admin_uri;
    req.auth = new auth(req, res, options);
    if (req.auth.can()) {
        next();
    } else {
        if (req.auth.user) {
            res.status(402).send('permission denied');
        } else {
            let curr = req.baseUrl || req.path;
            let goto = admin_uri('/auth/login');
            curr == goto ? next() : res.redirect(goto);
        }
    }
});

router.admin = function (path, controller, prefix) {
    router.get(admin_uri(path, prefix) + '/schema', router.controller(controller, 'schema'));
    router.get(admin_uri(path, prefix) + '/:id', router.controller(controller, 'detail'));
    router.get(admin_uri(path, prefix), router.controller(controller, 'grid'));
    router.post(admin_uri(path, prefix), router.controller(controller, 'form'));
    router.delete(admin_uri(path, prefix), router.controller(controller, 'delete'));
}

//自定义路由
router.get(admin_uri('/auth/user/menus'), router.controller('admin/welcome_controller', 'menus'));
router.get(admin_uri('/auth/user/dashboard'), router.controller('admin/welcome_controller', 'dashboard'));

//auth controller
router.get(admin_uri(), function (req, res) {
    let controller = new admin_auth_controller(req, res);
    controller.index(req, res);
});

router.get(admin_uri('/auth/login'), function (req, res) {
    let controller = new admin_auth_controller(req, res);
    controller.login(req, res);
});

router.get(admin_uri('/auth/logout'), function (req, res) {
    let controller = new admin_auth_controller(req, res);
    controller.logout(req, res);
});

router.post(admin_uri('/auth/login'), function (req, res) {
    let controller = new admin_auth_controller(req, res);
    controller.postLogin(req, res);
});

router.post(admin_uri('/auth/user/profile'), function (req, res) {
    let controller = new admin_auth_controller(req, res);
    controller.postProfile(req, res);
});

//user controller
router.get(admin_uri('/auth/user/schema'), function (req, res) {
    let controller = new admin_user_controller(req, res);
    controller.schema(req, res);
});

router.get(admin_uri('/auth/user/:id'), function (req, res) {
    let controller = new admin_user_controller(req, res);
    controller.detail(req, res);
});

router.get(admin_uri('/auth/user'), function (req, res) {
    let controller = new admin_user_controller(req, res);
    controller.grid(req, res);
});

router.post(admin_uri('/auth/user'), function (req, res) {
    let controller = new admin_user_controller(req, res);
    controller.form(req, res);
});

router.delete(admin_uri('/auth/user'), function (req, res) {
    let controller = new admin_user_controller(req, res);
    controller.delete(req, res);
});

//logs controller
router.get(admin_uri('/auth/logs/schema'), function (req, res) {
    let controller = new admin_logs_controller(req, res);
    controller.schema(req, res);
});

router.get(admin_uri('/auth/logs'), function (req, res) {
    let controller = new admin_logs_controller(req, res);
    controller.grid(req, res);
});

router.delete(admin_uri('/auth/logs'), function (req, res) {
    let controller = new admin_logs_controller(req, res);
    controller.delete(req, res);
});

//code controller
router.get(admin_uri('/auth/code/schema'), function (req, res) {
    let controller = new admin_code_controller(req, res);
    controller.schema(req, res);
});

router.post(admin_uri('/auth/code'), function (req, res) {
    let controller = new admin_code_controller(req, res);
    controller.form(req, res);
});

/**
 * 加载定时器
 */
(function () {
    let dir = process.cwd() + '/app/schedules/';
    let files = fs.readdirSync(dir);
    for (let i in files) {
        if (files[i].indexOf('.js') > 0) {
            let obj = require(dir + files[i]);
            if (obj.interval) {
                setInterval(obj.handle, obj.interval);
            }
        }
    }
})();