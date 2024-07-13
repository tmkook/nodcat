const controller = require('../../src/controller');
const repository = require('../repositories/admin_repository');
const crud = require('../../src/crud');
module.exports = class admin_auth_controller extends controller {
    index(req, res) {
        const amis = new crud(req);
        const page = JSON.stringify(amis.getAdmin());
        res.render('admin.html', { title: "Admin", page: page });
    }

    login(req, res) {
        const amis = new crud(req);
        let page = JSON.stringify(amis.getLogin());
        res.render('single.html', { title: "Login", page: page });
    }

    logout(req, res) {
        req.auth.logout();
        res.redirect(req.admin_uri('/auth/login'));
    }

    postLogin(req, res) {
        let repo = new repository;
        repo.login(req.body.username, req.body.password).then(user => {
            let exp = req.body.remember ? 86400 * 30 : 3600;
            req.auth.login(user, exp);
            res.success(user);
        }).catch(e => {
            res.error(e.toString());
        });
    }

    postProfile(req, res) {
        let repo = new repository;
        repo.profile(req.auth.user.data, req.body).then(user => {
            req.auth.login(user, req.auth.user.exp);
            res.success(user);
        }).catch(e => {
            res.error(e.toString());
        });
    }
}